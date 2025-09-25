import { initDatabase } from "../database.js";

export async function createOrder(userId, orderType, paymentMethod, cartMap, cookingInstruction = null) {
    const db = await initDatabase();

    try {
        const result = await db.run(
            `INSERT INTO Orders (user_id, order_type, payment_method, payment_status, order_status, cooking_instruction)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                orderType,
                paymentMethod || "cash",
                "pending",
                "pending",
                cookingInstruction
            ]
        );

        const orderId = result.lastID;

        for (const [itemId, cartItem] of Object.entries(cartMap)) {
            const { item, quantity, subtotal } = cartItem;

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
                    "pending"
                ]
            );
        }

        console.log(`Order ${orderId} created successfully.`);
        return { success: true, orderId };

    } catch (err) {
        console.error("Error creating order:", err);
        return { success: false, message: err.message };
    } finally {
        await db.close();
    }
}
