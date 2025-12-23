import React, { useState } from 'react';

const Search = ({ onSearch, placeholder = "Search articles..." }) => {
  const [query, setQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      onSearch(value.trim());
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onSearch('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
          >
            ×
          </button>
        )}
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;