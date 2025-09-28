import { query } from "../database.js";

export async function updateProfile(user, email) {
  if (!user) {
    return { success: false, message: "User profile details are required!" };
  }
  if (!user.fullname || !user.phone || !user.password || !user.address) {
    return { success: false, message: "All details are required" };
  }
  if (user.email !== email) {
    return { success: false, message: "Can only update your own profile!" };
  }

  try {
    const updateSQL = `
      UPDATE user_details
      SET fullname = $1,
          password = $2,
          phone = $3,
          address = $4,
          date_of_birth = $5,
          updated_at = NOW()
      WHERE email = $6
      RETURNING id, fullname, email, phone, address, date_of_birth, created_at, updated_at, user_role
    `;

    const values = [
      user.fullname,
      user.password,
      user.phone,
      user.address,
      user.date_of_birth || null,
      email,
    ];

    const result = await query(updateSQL, values);

    if (result.rowCount === 0) {
      return { success: false, message: `No user found with email: ${email}` };
    }

    const updatedUser = result.rows[0];
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile", error: error.message };
  }
}
