import _ from "lodash";
import { query } from "../database.js";


import { initDatabase } from "../database.js";


export async function generateOrderId() {
  try {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const prefix = `ORD-${month}${year}`;

    const latestOrder = await query(
      `SELECT order_id 
       FROM orders 
       WHERE order_id LIKE $1 
       ORDER BY order_id DESC 
       LIMIT 1`,
      [`${prefix}-%`]
    );

    let nextNumber = 1;
    if (latestOrder && latestOrder.order_id) {
      const parts = latestOrder.order_id.split("-");
      const lastSeq = parseInt(parts[2], 10);
      nextNumber = lastSeq + 1;
    }

    const sequence = String(nextNumber).padStart(3, "0");
    const newOrderId = `${prefix}-${sequence}`;
    return newOrderId;
  } catch (err) {
    console.error("Error generating order ID:", err);
    throw err;
  }
}

export async function createOrder(
  userId,
  orderType,
  paymentDetails,
  cartMap,
  cookingInstruction = null
) {
  try {
    const orderId = await generateOrderId()
    const insertOrderSQL = `
      INSERT INTO orders (
        order_id, user_id, order_type, payment_method, transaction_id,
        payment_status, order_status, cooking_instruction
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING order_id
    `;

    const orderResult = await query(insertOrderSQL, [
      orderId,
      userId,
      orderType,
      paymentDetails.paymentMethod || "cash",
      paymentDetails.transactionID || null,
      paymentDetails.status || "pending",
      "pending",
      cookingInstruction,
    ]);

    for (const [itemId, cartItem] of Object.entries(cartMap)) {
      const { item, quantity } = cartItem;

      const insertItemSQL = `
        INSERT INTO order_items (
          order_id, item_id, quantity, price, discount, special_instruction, item_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await query(insertItemSQL, [
        orderId,
        item.id,
        quantity,
        item.price,
        item.discount || 0,
        cartItem.instruction || null,
        "pending",
      ]);
    }

    return { success: true, orderId };
  } catch (err) {
    console.error("Error creating order:", err);
    return { success: false, message: err.message };
  }
}

export async function getUserOrders(userId) {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const ordersResult = await query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await query(
        `SELECT oi.*, m.name AS item_name, m.image_url
         FROM order_items oi
         JOIN menu m ON oi.item_id = m.id
         WHERE oi.order_id = $1`,
        [order.order_id]
      );
      order.items = itemsResult.rows;
    }

    const pastOrders = orders.filter((o) =>
      ["delivered", "cancelled"].includes(o.order_status)
    );
    const pastOrdersId = Object.keys(_.keyBy(pastOrders, "order_id"));
    const activeOrders = orders.filter(
      (o) => !pastOrdersId.includes(o.order_id)
    );

    return { success: true, pastOrders, activeOrders };
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return { success: false, message: err.message };
  }
}

export async function getAllOrders({ userId, page = 1, limit = 20 }) {
  try {
    let baseConditions = [];
    let params = [];

    if (userId) {
      baseConditions.push("o.user_id = $1");
      params.push(userId);
    }

    const baseWhere = baseConditions.length
      ? `WHERE ${baseConditions.join(" AND ")}`
      : "";
    const offset = (page - 1) * limit;

    const pastOrdersQuery = `
      SELECT o.*, u.email, u.fullname
      FROM orders o
      JOIN user_details u ON o.user_id = u.id
      ${baseWhere} ${baseWhere ? "AND" : "WHERE"} order_status IN ('delivered', 'cancelled')
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const pastOrdersResult = await query(pastOrdersQuery, [
      ...params,
      limit,
      offset,
    ]);

    const activeOrdersQuery = `
      SELECT o.*, u.email, u.fullname
      FROM orders o
      JOIN user_details u ON o.user_id = u.id
      ${baseWhere} ${baseWhere ? "AND" : "WHERE"} order_status NOT IN ('delivered', 'cancelled')
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const activeOrdersResult = await query(activeOrdersQuery, [
      ...params,
      limit,
      offset,
    ]);

    const pastOrders = pastOrdersResult.rows;
    const activeOrders = activeOrdersResult.rows;

    for (const order of [...pastOrders, ...activeOrders]) {
      const itemsResult = await query(
        `SELECT oi.*, m.name AS item_name, m.image_url
         FROM order_items oi
         JOIN menu m ON oi.item_id = m.id
         WHERE oi.order_id = $1`,
        [order.order_id]
      );
      order.items = itemsResult.rows;
    }

    return { success: true, activeOrders, pastOrders };
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return { success: false, message: err.message };
  }
}

export async function updateOrderStatus(orderId, orderStatus) {
  try {
    if (!orderId || !orderStatus) {
      return { success: false, message: "Order ID and status are required" };
    }

    const validStatuses = [
      "pending",
      "accepted",
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

    const updateSQL = `
      UPDATE orders
      SET order_status = $1, updated_at = NOW()
      WHERE order_id = $2
      RETURNING *
    `;
    const result = await query(updateSQL, [orderStatus, orderId]);

    if (result.rowCount === 0) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, message: "Order status updated successfully" };
  } catch (err) {
    console.error("Error updating order status:", err);
    return { success: false, message: err.message };
  }
}

export async function updateOrderItemStatus(orderItemId, itemStatus) {
  try {
    await query(
      "UPDATE order_items SET item_status = $1 WHERE order_item_id = $2",
      [itemStatus, orderItemId]
    );

    const currentOrderResult = await query(
      "SELECT order_id FROM order_items WHERE order_item_id = $1",
      [orderItemId]
    );

    if (currentOrderResult.rowCount === 0) {
      return { success: false, message: "Order item not found" };
    }

    const currentOrderId = currentOrderResult.rows[0].order_id;

    const allItemsResult = await query(
      "SELECT item_status FROM order_items WHERE order_id = $1",
      [currentOrderId]
    );

    const allReady = allItemsResult.rows.every(
      (item) => item.item_status === "ready"
    );

    if (allReady) {
      await query(
        "UPDATE orders SET order_status = 'ready-for-pickup', updated_at = NOW() WHERE order_id = $1",
        [currentOrderId]
      );
    } else {
      await query(
        "UPDATE orders SET updated_at = NOW() WHERE order_id = $1",
        [currentOrderId]
      );
    }

    return { success: true };
  } catch (err) {
    console.error("DB Error updateOrderItemStatus:", err);
    return { success: false, message: err.message };
  }
}

export async function deleteOrder(orderId) {
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    await query("DELETE FROM order_items WHERE order_id = $1", [orderId]);
    const result = await query("DELETE FROM orders WHERE order_id = $1", [
      orderId,
    ]);

    if (result.rowCount === 0) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, message: "Order deleted successfully" };
  } catch (err) {
    console.error("Error deleting order:", err);
    return { success: false, message: err.message };
  }
}
