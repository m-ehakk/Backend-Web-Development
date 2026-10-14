require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  // Invalid JSON sent by the user
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid request body'
      }
    });
  }

  // Do not expose Prisma/bcrypt error details
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});