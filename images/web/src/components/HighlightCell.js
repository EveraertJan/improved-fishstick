import React from 'react';

const HighlightCell = ({ itemId, content, searchQuery }) => {
  const highlightText = (text, query) => {
    if (!query || !query.trim()) {
      return text;
    }

    // Split query into individual terms
    const terms = query.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);

    if (terms.length === 0) {
      return text;
    }

    // Create regex pattern for all terms
    const pattern = terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Split text and wrap matches in mark tags
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = terms.some(term => part.toLowerCase() === term.toLowerCase());
      return isMatch ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      );
    });
  };

  const truncatedContent = content ? content.substring(0, 100) : '';
  const shouldTruncate = content && content.length > 100;

  return (
    <td className="item-highlight">
      {content ? (
        <a
          href={`/item/${itemId}`}
          className="highlight-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="highlight-text">
            {highlightText(truncatedContent, searchQuery)}
            {shouldTruncate ? '...' : ''}
          </span>
        </a>
      ) : (
        <span className="no-highlight">No highlight</span>
      )}
    </td>
  );
};

export default HighlightCell;
