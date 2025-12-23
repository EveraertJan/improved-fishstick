import React from 'react';

const SearchResultsInfo = ({ searchQuery, count, onClear }) => {
  const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);

  return (
    <div className="search-results-info">
      <div className="search-query-display">
        Found {count} results for &nbsp;
        <span className="search-terms-list">
          {searchTerms.map((term, index) => (
            <span key={index} className="search-term">{term}</span>
          ))}
        </span>
      </div>
      <button onClick={onClear} className="clear-search-filter">
        Clear Search
      </button>
    </div>
  );
};

export default SearchResultsInfo;
