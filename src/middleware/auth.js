const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev-secret";

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ error: "Missing or invalid token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const issue = (payload) => jwt.sign(payload, SECRET, { expiresIn: "1h" });

module.exports = { auth, issue };

// const auth = (req, res, next) => {
//   const header = req.headers.authorization || '';
//   const [, token] = header.split(' ');
//   if (!token) return res.status(401).json({ error: 'Missing token' });
//   try {
//     req.user = jwt.verify(token, SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// const issue = (payload) => jwt.sign(payload, SECRET, { expiresIn: '1h' });
