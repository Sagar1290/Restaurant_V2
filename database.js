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
      transaction_id TEXT, -- ✅ to track payment gateway reference
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
      ('Veg Burger', 'Fast Food', 'Whole wheat bun with spiced veggie patty.', 149, 5, 'https://placehold.co/400/png?text=3', 1, 'gluten', 1, 'bun, potato, peas, carrot, lettuce'),
      ('Chocolate Brownie', 'Dessert', 'Rich chocolate fudge brownie.', 89, 0, 'https://placehold.co/400/png?text=4', 1, 'nuts,milk', 1, 'cocoa, flour, butter, walnuts'),
      ('Tomato Soup', 'Soup', 'Creamy tomato soup with herbs.', 119, 0, 'https://placehold.co/400/png?text=5', 1, '', 1, 'tomato, cream, garlic, basil'),
      ('Margarita Pizza', 'Main Course', 'Classic pizza with cheese and tomato.', 229, 10, 'https://placehold.co/400/png?text=6', 1, 'gluten,milk', 1, 'pizza base, cheese, tomato, basil'),
      ('Greek Salad', 'Salad', 'Fresh veggies topped with feta cheese.', 129, 0, 'https://placehold.co/400/png?text=7', 1, 'milk', 1, 'lettuce, cucumber, feta, olives'),
      ('Fish Fingers', 'Starter', 'Crispy fried fish sticks.', 179, 10, 'https://placehold.co/400/png?text=8', 0, 'fish', 1, 'fish, breadcrumbs, egg, spices'),
      ('Gulab Jamun', 'Dessert', 'Authentic Indian sweet syrup balls.', 69, 0, 'https://placehold.co/400/png?text=9', 1, 'milk', 1, 'milk powder, flour, sugar, cardamom'),
      ('Butter Naan', 'Side', 'Soft leavened bread with butter.', 49, 0, 'https://placehold.co/400/png?text=10', 1, 'gluten,milk', 1, 'flour, butter, yeast, salt'),
      ('Spring Rolls', 'Appetizer', 'Vegetable spring rolls.', 99, 5, 'https://placehold.co/400/png?text=11', 1, '', 1, 'carrot, cabbage, wrappers, soy sauce'),
      ('Classic Cheeseburger', 'Fast Food', 'Beef burger with cheddar cheese.', 189, 10, 'https://placehold.co/400/png?text=12', 0, 'milk,gluten', 1, 'beef, bun, cheddar, lettuce'),
      ('Caesar Salad', 'Salad', 'Crisp romaine and parmesan.', 139, 10, 'https://placehold.co/400/png?text=13', 1, 'milk,fish', 1, 'romaine, parmesan, croutons, dressing'),
      ('Vegetable Sizzler', 'Main Course', 'Grilled veggies served sizzling.', 249, 15, 'https://placehold.co/400/png?text=14', 1, '', 1, 'potato, bell pepper, cauliflower, beans'),
      ('Mushroom Soup', 'Soup', 'Warm creamy mushroom soup.', 119, 0, 'https://placehold.co/400/png?text=15', 1, 'milk', 1, 'mushrooms, cream, onion, herbs'),
      ('Pasta Arrabiata', 'Main Course', 'Spicy Italian pasta.', 209, 10, 'https://placehold.co/400/png?text=16', 1, 'gluten', 1, 'pasta, tomato, chili flakes, garlic'),
      ('Chicken Wings', 'Starter', 'Spicy chicken wings.', 169, 15, 'https://placehold.co/400/png?text=17', 0, '', 1, 'chicken wings, hot sauce, butter'),
      ('Fruit Punch', 'Beverages', 'Mixed fruit drink.', 79, 0, 'https://placehold.co/400/png?text=18', 1, '', 1, 'orange, pineapple, apple, sugar'),
      ('Ice Cream Sundae', 'Dessert', 'Scoop of ice cream with topping.', 99, 0, 'https://placehold.co/400/png?text=19', 1, 'milk,nuts', 1, 'ice cream, chocolate syrup, nuts'),
      ('Garlic Bread', 'Side', 'Bread with garlic butter.', 59, 5, 'https://placehold.co/400/png?text=20', 1, 'gluten,milk', 1, 'bread, butter, garlic, parsley'),
      ('Veg Hakka Noodles', 'Main Course', 'Chinese style stir-fried noodles.', 159, 10, 'https://placehold.co/400/png?text=21', 1, 'gluten', 1, 'noodles, cabbage, carrot, soy sauce'),
      ('Lemon Mojito', 'Beverages', 'Refreshing lime mint drink.', 89, 0, 'https://placehold.co/400/png?text=22', 1, '', 1, 'lime, mint, soda, sugar'),
      ('Brownie Sundae', 'Dessert', 'Brownie with ice cream scoop.', 119, 10, 'https://placehold.co/400/png?text=23', 1, 'milk,nuts', 1, 'brownie, ice cream, chocolate syrup'),
      ('Tandoori Chicken', 'Main Course', 'Roasted chicken pieces.', 279, 12, 'https://placehold.co/400/png?text=24', 0, '', 1, 'chicken, yogurt, spices, lemon'),
      ('Cheese Nachos', 'Appetizer', 'Nachos served with cheese dip.', 99, 5, 'https://placehold.co/400/png?text=25', 1, 'milk', 1, 'nachos, cheese, jalapeno, salsa');
    `);

  await db.run(`
    INSERT INTO Orders (user_id, order_type, payment_method, transaction_id, payment_status, order_status, cooking_instruction)
    VALUES
      (1, 'online', 'UPI', 'TXN123456', 'successful', 'cooking', 'Less spicy please'),
      (2, 'dine-in', 'cash', NULL, 'pending', 'pending', 'Extra cheese on pizza'),
      (3, 'online', 'Card', 'TXN789012', 'failed', 'cancelled', 'Gluten free base if possible'),
      (4, 'online', 'Wallet', 'TXN456789', 'successful', 'ready-for-pickup', 'Pack separately'),
      (5, 'dine-in', 'cash', NULL, 'pending', 'accepted', 'No onions please');
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
