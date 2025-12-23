const sanitizeHtml = require('sanitize-html');

/**
 * Sanitize HTML content to keep only essential tags
 * Removes all div, style, css, class, id and other irrelevant tags
 * Keeps: header tags (h1-h6), paragraph (p), line break (br), and links (a)
 */
const sanitizeArticleHtml = (html) => {
  if (!html) return '';

  const cleanHtml = sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',  // Header tags
      'p',                                   // Paragraph
      'br',                                  // Line break
      'a'                                    // Links
    ],
    allowedAttributes: {
      'a': ['href']  // Only allow href attribute on links
    },
    allowedSchemes: ['http', 'https', 'mailto'],  // Only allow safe URL schemes
    // Remove all other tags but keep their text content
    nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript'],
    disallowedTagsMode: 'discard'
  });

  return cleanHtml.trim();
};

module.exports = {
  sanitizeArticleHtml
};
