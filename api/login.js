
import { client } from '../database.js'

export async function loginUser(email, password) {
    try {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const values = [email, password];

        const result = await client.query(query, values);

        if (result.rows.length === 1) {
            return { success: true, user: result.rows[0] };
        } else {
            return { success: false, message: 'Invalid credentials' };
        }
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, message: 'Server error' };
    }
}
