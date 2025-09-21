import jwt from "jsonwebtoken";

export function authMiddleWare(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email != req.body.email) {
      return res.status(401).json({ message: "Unauthorized Token" });
    }

    next();
  } catch (err) {
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
