// src/middleware/require-demo-auth.js
function requireDemoAuth(req, res, next) {
  const header = req.headers["x-demo-auth"];
  if (header === "ok") return next();
  return res.status(401).json({ error: "Demo auth required" });
}
module.exports = { requireDemoAuth };

//Call POST /transactions with header x-demo-auth: ok to pass.
