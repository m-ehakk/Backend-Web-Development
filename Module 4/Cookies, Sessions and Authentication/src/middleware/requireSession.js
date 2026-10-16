const sessionStore = require("../session/sessionStore");

module.exports = function requireSession(req, res, next) {
  const sessionId = req.signedCookies?.sid;

  // No valid signed sid cookie
  if (!sessionId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Find session on the server
  const session = sessionStore.get(sessionId);

  // Missing or expired session
  if (!session) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Attach identity for the next route
  req.userId = session.userId;
  req.sessionId = sessionId;

  next();
};