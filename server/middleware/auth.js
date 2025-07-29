import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 🟢 Make sure this line is present
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

export const isLeadOrAdmin = (req, res, next) => {
  if (req.user.role === "ProjectLead" || req.user.role === "Admin") return next();
  return res.status(403).json({ message: "Lead or Admin access required" });
};
