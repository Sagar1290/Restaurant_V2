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
  // Open (or create) the database file restaurant.db in project root folder
  const db = await open({
    filename: path.resolve(process.cwd(), "restaurant.db"),
    driver: sqlite3.Database,
  });

  // Create UserDetails table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS UserDetails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullname TEXT,
      password TEXT,
      phone TEXT,
      address TEXT,
      profile_photo TEXT,
      user_role TEXT DEFAULT 'customer', -- customer / admin / staff
      preferences TEXT, -- JSON: {"vegOnly": true, "allergies": "peanuts"}
      loyalty_points INTEGER DEFAULT 0,
      date_of_birth DATE,
      gender TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

  `);

  // Create UserOTP table
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

  // Insert dummy users
  await db.run(`
    INSERT OR IGNORE INTO UserDetails (email, fullname, password, phone, address, profile_photo, user_role, preferences, loyalty_points, date_of_birth, gender)
    VALUES
      ('alice@example.com', 'Alice Sharma', 'alicepass', '9876543210', '12 Main St, Bengaluru', 'https://avatar.iran.liara.run/public/20', 'customer', '{"vegOnly": true, "allergies": "peanuts"}', 0, '1990-05-15', 'male'),
      ('bob@example.com', 'Bob Singh', 'bobpass', '9999999999', '44 Baker Rd, Mumbai', 'https://avatar.iran.liara.run/public/10', 'manager', '{"vegOnly": false, "allergies": ""}', 0, '1985-08-20', 'male'),
      ('chef@gmail.com', 'Chef Lee', 'chefpass', '8888888888', 'Kitchen Ave, Chennai', 'https://avatar.iran.liara.run/public/30', 'chef', '{"vegOnly": false, "allergies": "gluten"}', 0, '1980-03-25', 'male');
  `);

  // Insert dummy OTP
  await db.run(`
    INSERT INTO UserOTP (email, otp, expireAt)
    VALUES
      ('alice@example.com', '123456', DATETIME('now', '+5 minutes')),
      ('bob@example.com', '654321', DATETIME('now', '+5 minutes'));
  `);

  await db.close();
  console.log("SQLite database setup completed.");
}
