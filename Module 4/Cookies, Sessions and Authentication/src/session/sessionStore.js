const crypto = require("crypto");

const sessions = new Map();

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

function create(userId) {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  sessions.set(sessionId, {
    userId,
    expiresAt,
  });

  return sessionId;
}

function get(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  // Remove session if it has expired
  if (new Date() >= session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

function destroy(sessionId) {
  sessions.delete(sessionId);
}

module.exports = {
  create,
  get,
  destroy,
  SESSION_TTL_MS,
};