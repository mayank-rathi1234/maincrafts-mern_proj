/**
 * Catches any request that didn't match a route and forwards
 * a 404 error into the central error handler.
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

module.exports = notFound;
