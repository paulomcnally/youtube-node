const YouTube = require('./lib/youtube');
const errors = require('./lib/errors');

// Exportar clase principal
module.exports = YouTube;

// Exportar clases de error directamente
module.exports.YouTubeError = errors.YouTubeError;
module.exports.QuotaExceededError = errors.QuotaExceededError;
module.exports.InvalidKeyError = errors.InvalidKeyError;
module.exports.ResourceNotFoundError = errors.ResourceNotFoundError;
module.exports.RateLimitError = errors.RateLimitError;
module.exports.ValidationError = errors.ValidationError;
module.exports.NetworkError = errors.NetworkError;
