
'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

// Create worker to process email jobs
const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { email, otp } = job.data;

      await transporter.sendMail({
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`
      });
    }
  },
  {
    connection,
    settings: {
      backoffStrategy: (attemptsMade) => {
        return 1000 * Math.pow(2, attemptsMade - 1);
      }
    }
  }
);

// Log successful jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

// Log failed jobs
worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

module.exports = worker;
