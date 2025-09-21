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

export async function updateMenuItem(id, itemDetail) {
  try {
    const requiredFields = [
      "name",
      "category",
      "description",
      "price",
      "discount",
      "image_url",
      "is_veg",
      "allergens",
      "available",
      "ingredients",
    ];

    const missingFields = [];
    for (const field of requiredFields) {
      if (!(field in itemDetail)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return { success: false, message: `Missing required fields: ${missingFields.join(', ')}` };
    }

    const {
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
    } = itemDetail;

    const db = await initDatabase();
    const CURRENT_TIMESTAMP = new Date().toISOString();

    const updateQuery = `
      UPDATE Menu
      SET 
        name = ?,
        category = ?,
        description = ?,
        price = ?,
        discount = ?,
        image_url = ?,
        is_veg = ?,
        allergens = ?,
        available = ?,
        ingredients = ?,
        updatedAt = ?
      WHERE id = ?
    `;

    const updateResults = await db.run(updateQuery, [
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
      CURRENT_TIMESTAMP,
      id,
    ]);

    if (updateResults.changes === 0) {
      return { success: false, message: `No menu item found with id: ${id}` };
    }

    const menuItems = await db.all("SELECT * from Menu");
    return { success: true, message: "Updated successfully!", menuItems };

  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, message: "Failed to update menu item", error: error.message };
  }
}

export async function deleteMenuItem(id) {
  try {
    const db = await initDatabase();
    const deleteQuery = "DELETE FROM Menu WHERE id = ?";
    await db.run(deleteQuery, [id]);

    return { success: true, message: "Item deleted successfully!" };

  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, message: "Failed to delete menu item", error: error.message };
  }
}
