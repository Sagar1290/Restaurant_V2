import _ from "lodash";
import { initDatabase } from "../database.js";

export async function createOrder(
  userId,
  orderType,
  paymentDetails,
  cartMap,
  cookingInstruction = null
) {
  const db = await initDatabase();

  try {
    const result = await db.run(
      `INSERT INTO Orders (
        user_id, order_type, payment_method, transaction_id,
        payment_status, order_status, cooking_instruction
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderType,
        paymentDetails.paymentMethod || "cash",
        paymentDetails.transactionID,
        paymentDetails.status,
        "pending",
        cookingInstruction,
      ]
    );

    const orderId = result.lastID;

    for (const [itemId, cartItem] of Object.entries(cartMap)) {
      const { item, quantity } = cartItem;

      await db.run(
        `INSERT INTO Order_Items (order_id, item_id, quantity, price, discount, special_instruction, item_status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          quantity,
          item.price,
          item.discount || 0,
          cartItem.instruction || null,
          "pending",
        ]
      );
    }

    return { success: true, orderId };
  } catch (err) {
    console.error("Error creating order:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}

export async function getUserOrders(userId) {
  const db = await initDatabase();
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const orders = await db.all(
      `SELECT * FROM Orders WHERE user_id = ? ORDER BY createdAt DESC`,
      [userId]
    );

    for (const order of orders) {
      const items = await db.all(
        `SELECT oi.*, m.name AS item_name, m.image_url 
         FROM Order_Items oi
         JOIN Menu m ON oi.item_id = m.id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    const pastOrders = orders.filter((item) => ['delivered', 'cancelled'].includes(item.order_status))
    const pastOrdersId = Object.keys(_.keyBy(pastOrders, 'order_id'))
    const activeOrders = orders.filter((order) => !pastOrdersId.includes(order.order_id))

    return { success: true, pastOrders, activeOrders };
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}

export async function getAllOrders({ userId, page = 1, limit = 20 }) {
  const db = await initDatabase();
  try {
    let baseConditions = [];
    let params = [];

    if (userId) {
      baseConditions.push("user_id = ?");
      params.push(userId);
    }

    const baseWhere = baseConditions.length ? `WHERE ${baseConditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const pastOrders = await db.all(
      `SELECT o.*, user.email, user.fullname FROM Orders o
       JOIN  UserDetails user ON o.user_id == user.id
       ${baseWhere} ${baseWhere ? "AND" : "WHERE"} order_status IN ('delivered', 'cancelled')
       ORDER BY createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const activeOrders = await db.all(
      `SELECT o.*, user.email, user.fullname FROM Orders o
       JOIN  UserDetails user ON o.user_id == user.id
       ${baseWhere} ${baseWhere ? "AND" : "WHERE"} order_status NOT IN ('delivered', 'cancelled')
       ORDER BY createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    for (const order of pastOrders) {
      const items = await db.all(
        `SELECT oi.*, m.name AS item_name, m.image_url
         FROM Order_Items oi
         JOIN Menu m ON oi.item_id = m.id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    for (const order of activeOrders) {
      const items = await db.all(
        `SELECT oi.*, m.name AS item_name, m.image_url
         FROM Order_Items oi
         JOIN Menu m ON oi.item_id = m.id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );
      order.items = items;
    }

    return { success: true, activeOrders, pastOrders };
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}

export async function updateOrderStatus(orderId, orderStatus) {
  const db = await initDatabase();
  try {
    if (!orderId || !orderStatus) {
      return { success: false, message: "Order ID and status are required" };
    }

    // Allowed statuses ('pending','accepted','cooking','ready-for-pickup','assigned','in-transit','delivered','cancelled')
    const validStatuses = [
      "accepted",
      "pending",
      "cooking",
      "ready-for-pickup",
      "assigned",
      "in-transit",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(orderStatus.toLowerCase())) {
      return { success: false, message: `Invalid status: ${orderStatus}` };
    }

    const result = await db.run(
      `UPDATE Orders SET order_status = ? WHERE order_id = ?`,
      [orderStatus, orderId]
    );

    if (result.changes === 0) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, message: "Order status updated successfully" };
  } catch (err) {
    console.error("Error updating order status:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}

export async function updateOrderItemStatus(orderItemId, itemStatus) {
  const db = await initDatabase();
  try {
    await db.run(
      "UPDATE order_items SET item_status = ? WHERE order_item_id = ?",
      [itemStatus, orderItemId]
    );
    const currentOrder = await db.get("SELECT order_id FROM order_items WHERE order_item_id = ?", [orderItemId])
    const currentOrderId = currentOrder["order_id"]

    const allOrderItems = await db.all("SELECT * FROM order_items where order_id = ?", [currentOrderId])

    var allReady = true
    allOrderItems.forEach((item) => {
      allReady = allReady && (item.item_status == "ready")
    })

    const now = new Date().toISOString()
    if (allReady) {
      await db.run(
        "UPDATE orders SET order_status = 'ready-for-pickup', updatedAt = ? WHERE order_id = ?",
        [now, currentOrderId]
      )
    } else {
      await db.run(
        "UPDATE orders SET updatedAt = ? WHERE order_id = ?",
        [now, currentOrderId]
      )
    }
    return { success: true };
  } catch (err) {
    console.error("DB Error updateOrderItemStatus:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}

export async function deleteOrder(orderId) {
  const db = await initDatabase();
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    // Delete order items first due to FK constraint
    await db.run(`DELETE FROM Order_Items WHERE order_id = ?`, [orderId]);

    const result = await db.run(`DELETE FROM Orders WHERE order_id = ?`, [
      orderId,
    ]);

    if (result.changes === 0) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, message: "Order deleted successfully" };
  } catch (err) {
    console.error("Error deleting order:", err);
    return { success: false, message: err.message };
  } finally {
    await db.close();
  }
}
