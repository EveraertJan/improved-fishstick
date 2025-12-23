import React from 'react';

const SourceLink = ({ url }) => {
  return (
    <td className="item-source">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="source-link"
          onClick={(e) => e.stopPropagation()}
        >
          {new URL(url).hostname}
        </a>
      ) : (
        <span className="no-source">No source</span>
      )}
    </td>
  );
};

export default SourceLink;
