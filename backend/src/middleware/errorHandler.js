export default function errorHandler(err, req, res, next) {
  const errCode = err.code || 'UNKNOWN';
  const errMessage = err.message || err;
  console.error('[ERROR]', errCode, errMessage);

  const knownCodes = [
    'INVALID_URL', 'BLOCKED_URL', 'TIMEOUT', 'BLOCKED', 'NOT_FOUND',
    'HTTP_ERROR', 'UNREACHABLE', 'SCRAPE_FAILED', 'NOT_HTML', 'EMPTY_CONTENT', 'AI_FAILED'
  ];

  if (err.code && knownCodes.includes(err.code)) {
    return res.status(422).json({
      error: err.code,
      message: err.message
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: message || err.message
    });
  }

  // Default to 500 Internal Server Error
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : (err.message || 'Internal Server Error');

  return res.status(status).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message
  });
}
