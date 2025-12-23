import React from 'react';

const EmptyState = ({ isSearchMode }) => {
  return (
    <div className="empty-state">
      <p>
        {isSearchMode
          ? `No results found for your search terms. Try removing some keywords or using different terms.`
          : 'No saved items yet.'
        }
      </p>
      {!isSearchMode && <p>Use the Firefox plugin to save articles and highlights!</p>}
    </div>
  );
};

export default EmptyState;
