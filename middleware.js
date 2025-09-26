import jwt from "jsonwebtoken";

export function authMiddleWare(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user_email = decoded["email"]
    req.user_id = decoded["id"]
    next();
  } catch (err) {
    console.log(err)
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function adminAuthMiddleWare(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role != "manager") {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
