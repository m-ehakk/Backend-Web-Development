/**
 * Articles service — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED here (and again in middleware/errorHandler.js). It should
 *     live once in utils/AppError.js and be imported in both places.
 *   - process.env.MAX_ARTICLES is read directly here. It should move into
 *     config/index.js and be imported as config.maxArticles.
 */

const repo = require('../repository/articlesRepo');
const AppError = require('../utils/AppError');
const config = require('../config');

exports.getAll = async () => repo.findAll();

exports.create = async ({ title, body }) => {
  const count = await repo.count();

  if (count >= config.maxArticles) {
    throw new AppError('Article limit reached', 403);
  }

  return repo.insert({ title, body });
};

exports.update = async (id, data) => {
  const article = await repo.findById(id);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  return repo.update(id, data);
};