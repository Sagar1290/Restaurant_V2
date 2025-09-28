import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DB_URI = os.getenv("DB_URI")


def create_postgres_tables(pg_conn):
    create_queries = [
        # --- USER DETAILS ---
        """
        CREATE TABLE IF NOT EXISTS user_details (
            id SERIAL PRIMARY KEY,
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # --- USER OTP ---
        """
        CREATE TABLE IF NOT EXISTS user_otp (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expire_at TIMESTAMP
        );
        """,
        # --- MENU ---
        """
        CREATE TABLE IF NOT EXISTS menu (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            price DOUBLE PRECISION NOT NULL,
            discount DOUBLE PRECISION DEFAULT 0,
            image_url TEXT,
            is_veg BOOLEAN DEFAULT TRUE,
            allergens TEXT,
            available BOOLEAN DEFAULT TRUE,
            ingredients TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # --- ORDERS ---
        """
        CREATE TABLE IF NOT EXISTS orders (
            order_id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            order_type TEXT CHECK (order_type IN ('dine-in','online')),
            table_no TEXT,
            payment_method TEXT,
            transaction_id TEXT,
            payment_status TEXT CHECK (payment_status IN ('pending','successful','failed','refunded')) DEFAULT 'pending',
            order_total DOUBLE PRECISION,
            order_status TEXT CHECK (order_status IN ('pending','accepted','cooking','ready-for-pickup','assigned','in-transit','delivered','cancelled')) DEFAULT 'pending',
            rider_id INTEGER,
            cooking_instruction TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES user_details(id)
        );
        """,
        # --- ORDER ITEMS ---
        """
        CREATE TABLE IF NOT EXISTS order_items (
            order_item_id SERIAL PRIMARY KEY,
            order_id TEXT NOT NULL,
            item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            discount DOUBLE PRECISION DEFAULT 0,
            special_instruction TEXT,
            item_status TEXT CHECK (item_status IN ('pending','cooking','ready','cancelled','served')) DEFAULT 'pending',
            FOREIGN KEY(order_id) REFERENCES Orders(order_id),
            FOREIGN KEY(item_id) REFERENCES Menu(id)
        );
        """,
    ]

    with pg_conn.cursor() as cur:
        for query in create_queries:
            cur.execute(query)
    pg_conn.commit()
    print("Tables created successfully in Postgres!")


def seed_data(pg_conn):
    with pg_conn.cursor() as cur:
        # Insert Users
        cur.execute(
            """
        INSERT INTO user_details (email, fullname, password, phone, address, profile_photo, user_role, preferences, loyalty_points, date_of_birth, gender)
        VALUES
          ('alice@example.com', 'Alice Sharma', 'alicepass', '9876543210', '12 Main St, Bengaluru', 'https://avatar.iran.liara.run/public/20', 'customer', '{"vegOnly": true, "allergies": "peanuts"}', 0, '1990-05-15', 'female'),
          ('bob@example.com', 'Bob Singh', 'bobpass', '9999999999', '44 Baker Rd, Mumbai', 'https://avatar.iran.liara.run/public/10', 'manager', '{"vegOnly": false, "allergies": ""}', 0, '1985-08-20', 'male'),
          ('chef@gmail.com', 'Chef Lee', 'chefpass', '8888888888', 'Kitchen Ave, Chennai', 'https://avatar.iran.liara.run/public/30', 'chef', '{"vegOnly": false, "allergies": "gluten"}', 0, '1980-03-25', 'male')
        ON CONFLICT (email) DO NOTHING;
        """
        )

        # Insert Menu Items
        cur.execute(
            """
        INSERT INTO menu (name, category, description, price, discount, image_url, is_veg, allergens, available, ingredients)
        VALUES
          ('Paneer Tikka', 'Starter', 'Grilled paneer cubes marinated with spices.', 199, 10, 'https://placehold.co/400/png?text=1', TRUE, 'milk', TRUE, 'paneer, yogurt, spices, bell pepper'),
          ('Chicken Biryani', 'Main Course', 'Aromatic basmati rice with tender chicken pieces.', 299, 15, 'https://placehold.co/400/png?text=2', FALSE, '', TRUE, 'chicken, rice, spices, yogurt'),
          ('Veg Burger', 'Fast Food', 'Whole wheat bun with spiced veggie patty.', 149, 5, 'https://placehold.co/400/png?text=3', TRUE, 'gluten', TRUE, 'bun, potato, peas, carrot, lettuce'),
          ('Chocolate Brownie', 'Dessert', 'Rich chocolate fudge brownie.', 89, 0, 'https://placehold.co/400/png?text=4', TRUE, 'nuts,milk', TRUE, 'cocoa, flour, butter, walnuts'),
          ('Tomato Soup', 'Soup', 'Creamy tomato soup with herbs.', 119, 0, 'https://placehold.co/400/png?text=5', TRUE, '', TRUE, 'tomato, cream, garlic, basil'),
          ('Margarita Pizza', 'Main Course', 'Classic pizza with cheese and tomato.', 229, 10, 'https://placehold.co/400/png?text=6', TRUE, 'gluten,milk', TRUE, 'pizza base, cheese, tomato, basil'),
          ('Greek Salad', 'Salad', 'Fresh veggies topped with feta cheese.', 129, 0, 'https://placehold.co/400/png?text=7', TRUE, 'milk', TRUE, 'lettuce, cucumber, feta, olives'),
          ('Fish Fingers', 'Starter', 'Crispy fried fish sticks.', 179, 10, 'https://placehold.co/400/png?text=8', FALSE, 'fish', TRUE, 'fish, breadcrumbs, egg, spices'),
          ('Gulab Jamun', 'Dessert', 'Authentic Indian sweet syrup balls.', 69, 0, 'https://placehold.co/400/png?text=9', TRUE, 'milk', TRUE, 'milk powder, flour, sugar, cardamom'),
          ('Butter Naan', 'Side', 'Soft leavened bread with butter.', 49, 0, 'https://placehold.co/400/png?text=10', TRUE, 'gluten,milk', TRUE, 'flour, butter, yeast, salt'),
          ('Spring Rolls', 'Appetizer', 'Vegetable spring rolls.', 99, 5, 'https://placehold.co/400/png?text=11', TRUE, '', TRUE, 'carrot, cabbage, wrappers, soy sauce'),
          ('Classic Cheeseburger', 'Fast Food', 'Beef burger with cheddar cheese.', 189, 10, 'https://placehold.co/400/png?text=12', FALSE, 'milk,gluten', TRUE, 'beef, bun, cheddar, lettuce'),
          ('Caesar Salad', 'Salad', 'Crisp romaine and parmesan.', 139, 10, 'https://placehold.co/400/png?text=13', TRUE, 'milk,fish', TRUE, 'romaine, parmesan, croutons, dressing'),
          ('Vegetable Sizzler', 'Main Course', 'Grilled veggies served sizzling.', 249, 15, 'https://placehold.co/400/png?text=14', TRUE, '', TRUE, 'potato, bell pepper, cauliflower, beans'),
          ('Mushroom Soup', 'Soup', 'Warm creamy mushroom soup.', 119, 0, 'https://placehold.co/400/png?text=15', TRUE, 'milk', TRUE, 'mushrooms, cream, onion, herbs'),
          ('Pasta Arrabiata', 'Main Course', 'Spicy Italian pasta.', 209, 10, 'https://placehold.co/400/png?text=16', TRUE, 'gluten', TRUE, 'pasta, tomato, chili flakes, garlic'),
          ('Chicken Wings', 'Starter', 'Spicy chicken wings.', 169, 15, 'https://placehold.co/400/png?text=17', FALSE, '', TRUE, 'chicken wings, hot sauce, butter'),
          ('Fruit Punch', 'Beverages', 'Mixed fruit drink.', 79, 0, 'https://placehold.co/400/png?text=18', TRUE, '', TRUE, 'orange, pineapple, apple, sugar'),
          ('Ice Cream Sundae', 'Dessert', 'Scoop of ice cream with topping.', 99, 0, 'https://placehold.co/400/png?text=19', TRUE, 'milk,nuts', TRUE, 'ice cream, chocolate syrup, nuts'),
          ('Garlic Bread', 'Side', 'Bread with garlic butter.', 59, 5, 'https://placehold.co/400/png?text=20', TRUE, 'gluten,milk', TRUE, 'bread, butter, garlic, parsley'),
          ('Veg Hakka Noodles', 'Main Course', 'Chinese style stir-fried noodles.', 159, 10, 'https://placehold.co/400/png?text=21', TRUE, 'gluten', TRUE, 'noodles, cabbage, carrot, soy sauce'),
          ('Lemon Mojito', 'Beverages', 'Refreshing lime mint drink.', 89, 0, 'https://placehold.co/400/png?text=22', TRUE, '', TRUE, 'lime, mint, soda, sugar'),
          ('Brownie Sundae', 'Dessert', 'Brownie with ice cream scoop.', 119, 10, 'https://placehold.co/400/png?text=23', TRUE, 'milk,nuts', TRUE, 'brownie, ice cream, chocolate syrup'),
          ('Tandoori Chicken', 'Main Course', 'Roasted chicken pieces.', 279, 12, 'https://placehold.co/400/png?text=24', FALSE, '', TRUE, 'chicken, yogurt, spices, lemon'),
          ('Cheese Nachos', 'Appetizer', 'Nachos served with cheese dip.', 99, 5, 'https://placehold.co/400/png?text=25', TRUE, 'milk', TRUE, 'nachos, cheese, jalapeno, salsa')
        """
        )

    pg_conn.commit()
    print("Seed data inserted successfully!")


def main():
    conn = psycopg2.connect(DB_URI)
    create_postgres_tables(conn)
    seed_data(conn)
    conn.close()


if __name__ == "__main__":
    main()
