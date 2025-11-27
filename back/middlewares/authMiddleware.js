import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ ok: false, error: "No autenticado" });
  }
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: "No autenticado" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }
    next();
  };
};
