
'use strict';

// Import express-rate-limit
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  // 15 minutes time window
  windowMs: 15 * 60 * 1000,

  // Allow maximum 5 attempts per IP
  max: 5,

  // Use standard rate-limit headers
  standardHeaders: true,

  // Disable older headers
  legacyHeaders: false,

  // Only failed requests should count
  skipSuccessfulRequests: true,

  // Response when the limit is exceeded
  handler: (req, res) => {
    const retryAfter = req.rateLimit.resetTime
      ? Math.max(
          1,
          Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
        )
      : 900;

    res.setHeader('Retry-After', String(retryAfter));

    res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }
});

// Export the limiter middleware
module.exports = authLimiter;

/*
Redis support in multiple server instances:

In a multi-instance deployment, we can use rate-limit-redis
with express-rate-limit by configuring a Redis-backed store.

Redis replaces the default in-memory store and keeps request
counters in a shared database.

The in-memory store is not sufficient because each server
instance maintains its own separate counter. When requests
are distributed across multiple servers by a load balancer,
a user may get more attempts than the allowed limit.

Redis solves this problem because all server instances share
the same request counter.
*/
