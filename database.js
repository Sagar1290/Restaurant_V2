import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
let db;

export async function initDatabase() {
  db = await open({
    filename: path.resolve(process.cwd(), "restaurant.db"),
    driver: sqlite3.Database,
  });

  console.log("Connected to SQLite database");

  return db;
}

export async function setupDatabase() {
  const db = await open({
    filename: path.resolve(process.cwd(), "restaurant.db"),
    driver: sqlite3.Database,
  });

  // --- USERS ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS UserDetails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullname TEXT,
      password TEXT,
      phone TEXT,
      address TEXT,
      profile_photo TEXT,
      user_role TEXT DEFAULT 'customer',
      preferences TEXT,
      loyalty_points INTEGER DEFAULT 0,
      date_of_birth DATE,
      gender TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS UserOTP (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expireAt DATETIME,
      FOREIGN KEY(email) REFERENCES UserDetails(email)
    );
  `);

  // --- MENU ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      image_url TEXT,
      is_veg BOOLEAN DEFAULT 1,
      allergens TEXT,
      available BOOLEAN DEFAULT 1,
      ingredients TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // --- ORDERS ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      order_type TEXT CHECK (order_type IN ('dine-in','online')),
      table_no TEXT,
      payment_method TEXT,
      payment_status TEXT CHECK (payment_status IN ('pending','successful','failed','refunded')) DEFAULT 'pending',
      order_status TEXT CHECK (order_status IN ('pending','accepted','cooking','ready-for-pickup','assigned','in-transit','delivered','cancelled')) DEFAULT 'pending',
      rider_id INTEGER,
      cooking_instruction TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES UserDetails(id)
    );
  `);

  // --- ORDER ITEMS ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Order_Items (
      order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      special_instruction TEXT,
      item_status TEXT CHECK (item_status IN ('pending','cooking','ready','cancelled','served')) DEFAULT 'pending',
      FOREIGN KEY(order_id) REFERENCES Orders(order_id),
      FOREIGN KEY(item_id) REFERENCES Menu(id)
    );
  `);

  // --- Dummy Data Inserts ---
  await db.run(`
    INSERT OR IGNORE INTO UserDetails (email, fullname, password, phone, address, profile_photo, user_role, preferences, loyalty_points, date_of_birth, gender)
    VALUES
      ('alice@example.com', 'Alice Sharma', 'alicepass', '9876543210', '12 Main St, Bengaluru', 'https://avatar.iran.liara.run/public/20', 'customer', '{"vegOnly": true, "allergies": "peanuts"}', 0, '1990-05-15', 'female'),
      ('bob@example.com', 'Bob Singh', 'bobpass', '9999999999', '44 Baker Rd, Mumbai', 'https://avatar.iran.liara.run/public/10', 'manager', '{"vegOnly": false, "allergies": ""}', 0, '1985-08-20', 'male'),
      ('chef@gmail.com', 'Chef Lee', 'chefpass', '8888888888', 'Kitchen Ave, Chennai', 'https://avatar.iran.liara.run/public/30', 'chef', '{"vegOnly": false, "allergies": "gluten"}', 0, '1980-03-25', 'male');
  `);

  await db.run(`
    INSERT INTO UserOTP (email, otp, expireAt)
    VALUES
      ('alice@example.com', '123456', DATETIME('now', '+5 minutes')),
      ('bob@example.com', '654321', DATETIME('now', '+5 minutes'));
  `);

  await db.run(`
    INSERT INTO Menu (name, category, description, price, discount, image_url, is_veg, allergens, available, ingredients) VALUES
      ('Paneer Tikka', 'Starter', 'Grilled paneer cubes marinated with spices.', 199, 10, 'https://placehold.co/400/png?text=1', 1, 'milk', 1, 'paneer, yogurt, spices, bell pepper'),
      ('Chicken Biryani', 'Main Course', 'Aromatic basmati rice with tender chicken pieces.', 299, 15, 'https://placehold.co/400/png?text=2', 0, '', 1, 'chicken, rice, spices, yogurt'),
      ('Veg Burger', 'Fast Food', 'Whole wheat bun with spiced veggie patty.', 149, 5, 'https://placehold.co/400/png?text=3', 1, 'gluten', 1, 'bun, potato, peas, carrot, lettuce');
  `);

  await db.run(`
    INSERT INTO Orders (user_id, order_type, payment_method, payment_status, order_status, cooking_instruction)
    VALUES
      (1, 'online', 'UPI', 'successful', 'cooking', 'Less spicy please'),
      (2, 'dine-in', 'cash', 'pending', 'pending', 'Extra cheese on pizza');
  `);

  await db.run(`
    INSERT INTO Order_Items (order_id, item_id, quantity, price, discount, special_instruction, item_status)
    VALUES
      (1, 1, 2, 199, 10, 'No onions', 'cooking'),
      (1, 3, 1, 149, 5, 'Extra lettuce', 'pending'),
      (2, 2, 1, 299, 15, 'Extra spicy', 'pending');
  `);

  await db.close();
  console.log("SQLite database setup completed.");
}
