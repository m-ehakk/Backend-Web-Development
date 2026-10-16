const { SESSION_TTL_MS } = require('../session/sessionStore');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  signed: true,
  maxAge: SESSION_TTL_MS,
  path: '/'
};

const clearCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  signed: true,
  path: '/'
};

module.exports = {
  cookieOptions,
  clearCookieOptions
};