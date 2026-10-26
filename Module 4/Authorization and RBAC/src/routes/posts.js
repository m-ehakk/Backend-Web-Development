const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const { posts } = require('../data');

// Hide post: Moderator or Admin only
router.post('/:id/hide', requireAuth, requireRole('moderator', 'admin'), (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' }
    });
  }
  post.hidden = true;
  res.json(post);
});

// PATCH /posts/:id — Edit post (Owner or privileged roles)
router.patch('/:id', requireAuth, (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  
  // 1. Check 404 first (must be before ownership check)
  if (!post) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' }
    });
  }

  // 2. Check ownership or privileged roles (moderator/admin)
  const isOwner = post.authorId === req.user.id;
  const isPrivileged = ['moderator', 'admin'].includes(req.user.role);

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'You do not have permission to modify this post' }
    });
  }

  // Update post fields
  if (req.body.title !== undefined) post.title = req.body.title;
  if (req.body.content !== undefined) post.content = req.body.content;

  res.json(post);
});

// DELETE /posts/:id — Delete post (Owner or privileged roles)
router.delete('/:id', requireAuth, (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  
  // 1. Check 404 first (must be before ownership check)
  if (postIndex === -1) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' }
    });
  }

  const post = posts[postIndex];

  // 2. Check ownership or privileged roles
  const isOwner = post.authorId === req.user.id;
  const isPrivileged = ['moderator', 'admin'].includes(req.user.role);

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this post' }
    });
  }

  posts.splice(postIndex, 1);
  res.json({ success: true });
});

module.exports = router;