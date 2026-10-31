'use strict';

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // Rule 1: Reject requests without an Idempotency-Key.
  const key = req.headers['idempotency-key'];

  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Rule 2: Return the stored response for a repeated key.
  if (idempotency.has(key)) {
    const saved = idempotency.get(key);
    return res.status(saved.status).json(saved.body);
  }

  // Rule 3: Create one charge for a new key.
  const amount = req.body && req.body.amount;

  const charge = {
    id: nextChargeId(),
    amount,
    status: 'charged'
  };

  charges.push(charge);

  // Store the complete response.
  const status = 201;
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status
  };

  idempotency.set(key, { status, body });

  // Return the response.
  return res.status(status).json(body);
});

module.exports = router;