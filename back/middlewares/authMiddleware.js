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

const normalizeRole = (rol) => {
  const s = (typeof rol === "string" ? rol : rol?.nombre_rol || "").toLowerCase();
  if (s === "admin" || s === "administrador") return "Administrador";
  if (s === "paciente" || s === "usuario") return "Usuario";
  if (s === "profesional" || s === "médico" || s === "medico" || s === "doctor") return "Profesional";
  return typeof rol === "string" ? rol : rol?.nombre_rol;
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: "No autenticado" });
    }
    const currentRole = normalizeRole(req.user.rol);
    const allowed = roles.map(normalizeRole);
    if (!allowed.includes(currentRole)) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }
    next();
  };
};
