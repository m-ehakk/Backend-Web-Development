const postStore = require('../data/postStore');

/*
 * Repository boundary:
 *
 * If we replace this Map-backed storage with Prisma in the future,
 * only the internal implementation of this repository will change.
 *
 * The repository methods will remain the same:
 * findAll(), findById(), create(), update(), and remove().
 *
 * Services and controllers will not need to change because they depend
 * only on this repository contract, not on the storage technology.
 */

// Convert the starter array into a Map.
// Key = post id
// Value = complete post object
const posts = new Map(
  postStore.posts.map((post) => [post.id, post])
);

// Repository owns id generation.
let nextId =
  postStore.posts.length > 0
    ? Math.max(...postStore.posts.map((post) => post.id)) + 1
    : 1;

function findAll() {
  // Returns a new array instead of exposing internal storage.
  return Array.from(posts.values());
}

function findById(id) {
  return posts.get(Number(id)) || null;
}

function create(fields) {
  const post = {
    id: nextId++,
    ...fields,
  };

  posts.set(post.id, post);

  return post;
}

function update(id, patch) {
  const numericId = Number(id);

  const existingPost = posts.get(numericId);

  if (!existingPost) {
    return null;
  }

  const updatedPost = {
    ...existingPost,
    ...patch,
  };

  posts.set(numericId, updatedPost);

  return updatedPost;
}

function remove(id) {
  return posts.delete(Number(id));
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};