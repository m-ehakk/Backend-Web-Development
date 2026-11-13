
'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify HMAC-SHA256 signature
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if (!signature || !signature.startsWith('sha256=') || !secret || !Buffer.isBuffer(req.body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  const received = signature.slice('sha256='.length);

  // Validate length and format before timingSafeEqual
  if (!/^[a-fA-F0-9]{64}$/.test(received)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  if (!crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Step 2: Parse the body after verification
  const event = JSON.parse(req.body);

  // Step 3: Check for duplicate events
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // Step 4: Mark event as processed
  _processedIds.add(event.id);

  // Step 5: Acknowledge immediately
  res.status(200).json({ status: 'received' });

  // Process the event after sending the response
  setImmediate(() => {
    Promise.resolve(handleEvent(event)).catch((error) => {
      console.error('Webhook processing failed:', error);
    });
  });
}

module.exports = { handleWebhook, _processedIds };
