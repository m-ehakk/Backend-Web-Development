const store = require('../data/postStore');

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  const page = Math.max(1, Number(query.page) || 1);
  const requestedLimit = Number(query.limit) || 2;
  const limit = Math.min(Math.max(1, requestedLimit), 5);

  const start = (page - 1) * limit;
  const posts = allPosts.slice(start, start + limit);

  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);

  return {
    posts,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
