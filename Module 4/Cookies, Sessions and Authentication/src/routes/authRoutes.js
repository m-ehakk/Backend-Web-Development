const express = require('express');
const bcrypt = require('bcryptjs');

const {
  findUserByEmail,
  findUserById
} = require('../repositories/userRepository');

const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const {
  cookieOptions,
  clearCookieOptions
} = require('../config/cookieOptions');

const router = express.Router();


// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate input
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Email and password are required'
        }
      });
    }

    // Normalize email
    email = email.trim().toLowerCase();

    // Find user from database
    const user = await findUserByEmail(email);

    // Unknown email
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    // Wrong password
    if (!passwordMatches) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Create server-side session
    const sessionId = sessionStore.create(user.id);

    // Send opaque session ID in signed cookie
    res.cookie('sid', sessionId, cookieOptions);

    // Return safe user information only
    return res.status(200).json({
      id: user.id,
      email: user.email
    });

  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});


// GET CURRENT USER
router.get('/me', requireSession, async (req, res) => {
  try {
    const user = await findUserById(req.userId);

    // Session exists but user no longer exists
    if (!user) {
      sessionStore.destroy(req.sessionId);

      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        }
      });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email
    });

  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      }
    });
  }
});


// LOGOUT
router.post('/logout', (req, res) => {
  try {
    const sessionId = req.signedCookies?.sid;

    // Delete server-side session
    if (sessionId) {
      sessionStore.destroy(sessionId);
    }

    // Clear browser cookie
    res.clearCookie('sid', clearCookieOptions);

    return res.status(204).send();

  } catch (error) {
    // Logout is idempotent
    return res.status(204).send();
  }
});


module.exports = router;