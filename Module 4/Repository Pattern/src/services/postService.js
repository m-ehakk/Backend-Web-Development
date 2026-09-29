const postRepository = require('../repositories/postRepository');

function listPosts() {
  return postRepository.findAll();
}

function getPost(id) {
  return postRepository.findById(id);
}

function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  const post = {
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  };

  return postRepository.create(post);
}

function updatePost(id, patch) {
  const post = getPost(id);

  if (!post) {
    return null;
  }

  const changes = {};

  if (patch.title !== undefined) {
    changes.title = patch.title;
  }

  if (patch.body !== undefined) {
    changes.body = patch.body;
  }

  return postRepository.update(id, changes);
}

function removePost(id) {
  return postRepository.remove(id);
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  removePost,
};