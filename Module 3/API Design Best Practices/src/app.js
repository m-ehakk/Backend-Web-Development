const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  app.get('/internal-error', controller.explode);

  app.use((req, res) => {
    return res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};