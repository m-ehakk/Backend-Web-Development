
'use strict';

const store = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  store.set(email, {
    otp: otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0
  });
}

function verifyOTP(email, code) {
  const record = store.get(email);

  // 1. Check if OTP exists
  if (!record) {
    return { ok: false, reason: 'not_found' };
  }

  // 2. Check if OTP has expired
  if (Date.now() > record.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  // 3. Check attempt limit
  if (record.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  // 4. Check incorrect OTP
  if (record.otp !== code) {
    record.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  // 5. Correct OTP - delete it after successful verification
  store.delete(email);

  return { ok: true };
}

function markVerified(email) {
  console.log(`Email verified successfully: ${email}`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store
};
