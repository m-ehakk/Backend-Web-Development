function sendList(res, result) {
  return res.status(200).json({
    data: {
      posts: result.posts
    },
    meta: result.meta
  });
}

function sendCreated(res, post) {
  return res.status(201).json({
    data: {
      post
    }
  });
}

function sendOk(res, payload) {
  return res.status(200).json({
    data: payload
  });
}

function sendError(res, status, code, message) {
  return res.status(status).json({
    error: {
      code,
      message
    }
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError
};