import { initDatabase } from "../database.js";

export async function getAllMenuItems() {
  const db = await initDatabase();
  const getMenuItemsQuery = `
        SELECT * FROM Menu
    `;
  const menuItems = await db.all(getMenuItemsQuery);
  await db.close();

  if (menuItems) {
    return {
      success: true,
      menuItems,
    };
  } else {
    return { success: false, message: "No Items found!" };
  }
}

export async function getMenuItem(id) {
  const db = await initDatabase();
  const getMenuItemsQuery = `
        SELECT * FROM Menu WHERE id=?
    `;
  const menuItem = await db.get(getMenuItemsQuery, [id]);
  await db.close();

  if (menuItem) {
    return {
      success: true,
      menuItem,
    };
  } else {
    return { success: false, message: "No Item found!" };
  }
}

export async function createMenuItem(itemDetail) {
  const requiredFields = ["name", "category", "price"];

  for (const field of requiredFields) {
    if (!itemDetail?.[field]) {
      return {
        success: false,
        message: `Missing required field: ${field}`,
      };
    }
  }

  const {
    name,
    category,
    description = "",
    price,
    discount = 0,
    image_url = "",
    is_veg = true,
    allergens = "",
    available = true,
    ingredients = "",
  } = itemDetail;

  try {
    const db = await initDatabase();

    const insertQuery = `
      INSERT INTO Menu (
        name,
        category,
        description,
        price,
        discount,
        image_url,
        is_veg,
        allergens,
        available,
        ingredients,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `;

    await db.run(insertQuery, [
      name,
      category,
      description,
      price,
      discount,
      image_url,
      is_veg ? 1 : 0,
      typeof allergens === "object" ? JSON.stringify(allergens) : allergens,
      available ? 1 : 0,
      typeof ingredients === "object"
        ? JSON.stringify(ingredients)
        : ingredients,
    ]);

    await db.close();

    return {
      success: true,
      message: "Menu item created successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create menu item.",
      error: error.message,
    };
  }
}

export async function updateMenuItem() {}
export async function deleteMenuItem() {}
