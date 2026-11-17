export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error.';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for field: ${Object.keys(err.keyValue || {}).join(', ')}`;
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier format.';
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'Uploaded file is too large.';
  }

  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ message });
}
