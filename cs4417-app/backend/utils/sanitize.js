const sanitizeHtml = require('sanitize-html');

function sanitizePlainText(value) {
  if (typeof value !== 'string') return '';

  const normalized = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ');

  return sanitizeHtml(normalized, {
    allowedTags: [],
    allowedAttributes: {}
  })
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  sanitizePlainText
};
