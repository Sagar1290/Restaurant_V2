import { query } from "../database.js";

/**
 * Get all menu items
 */
export async function getAllMenuItems() {
  try {
    const result = await query("SELECT * FROM Menu");
    if (result.rows.length > 0) {
      return { success: true, menuItems: result.rows };
    } else {
      return { success: false, message: "No items found!" };
    }
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { success: false, message: "Failed to fetch menu items", error: error.message };
  }
}

/**
 * Get menu item by ID
 */
export async function getMenuItem(id) {
  try {
    const result = await query("SELECT * FROM Menu WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      return { success: true, menuItem: result.rows[0] };
    } else {
      return { success: false, message: "No item found!" };
    }
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return { success: false, message: "Failed to fetch menu item", error: error.message };
  }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(itemDetail) {
  const requiredFields = ["name", "category", "price"];
  for (const field of requiredFields) {
    if (!itemDetail?.[field]) {
      return { success: false, message: `Missing required field: ${field}` };
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
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      name,
      category,
      description,
      price,
      discount,
      image_url,
      is_veg,
      typeof allergens === "object" ? JSON.stringify(allergens) : allergens,
      available,
      typeof ingredients === "object" ? JSON.stringify(ingredients) : ingredients,
    ];

    const result = await query(insertQuery, values);

    return { success: true, message: "Menu item created successfully!", menuItem: result.rows[0] };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return { success: false, message: "Failed to create menu item", error: error.message };
  }
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(id, itemDetail) {
  try {
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

    const updateQuery = `
      UPDATE Menu
      SET 
        name = $1,
        category = $2,
        description = $3,
        price = $4,
        discount = $5,
        image_url = $6,
        is_veg = $7,
        allergens = $8,
        available = $9,
        ingredients = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const values = [
      name,
      category,
      description,
      price,
      discount,
      image_url,
      is_veg,
      typeof allergens === "object" ? JSON.stringify(allergens) : allergens,
      available,
      typeof ingredients === "object" ? JSON.stringify(ingredients) : ingredients,
      id,
    ];

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return { success: false, message: `No menu item found with id: ${id}` };
    }

    return { success: true, message: "Updated successfully!", menuItem: result.rows[0] };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, message: "Failed to update menu item", error: error.message };
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id) {
  try {
    const result = await query("DELETE FROM Menu WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return { success: false, message: `No menu item found with id: ${id}` };
    }

    return { success: true, message: "Item deleted successfully!" };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, message: "Failed to delete menu item", error: error.message };
  }
}
