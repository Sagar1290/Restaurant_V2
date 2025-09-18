import { initDatabase } from "../database.js";

export async function updateProfile(user, email) {
  if (!user) {
    return { success: false, message: "User Profile details are required!" };
  }
  if (!user.fullname || !user.phone || !user.password || !user.address) {
    return { success: false, message: "All details are required" };
  }
  if (user.email != email) {
    return { success: false, message: "Can Only update your profile!" };
  }

  const db = await initDatabase();
  const currentDate = new Date().toISOString();
  const insertProfileSQL = `UPDATE UserDetails 
        SET fullname = ?, password = ?, phone = ?, address = ?, date_of_birth = ?, updatedAt = ?
        WHERE email = ?
    `;
  await db.run(insertProfileSQL, [
    user.fullname,
    user.password,
    user.phone,
    user.address,
    user.date_of_birth,
    currentDate,
    email,
  ]);

  const userResult = await db.get("SELECT * FROM UserDetails WHERE email = ?", [
    email,
  ]);

  await db.close();
  return { success: true, user: userResult };
}
