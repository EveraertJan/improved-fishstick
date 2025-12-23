import React, { useState, useEffect, useRef } from 'react';
import Search from './Search';

const BulkActions = ({
  itemsCount,
  selectedCount,
  allSelected,
  bulkActionLoading,
  onSelectAll,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onRefresh,
  onSearch,
  searchPlaceholder
}) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSelectMenu(false);
      }
    };

    if (showSelectMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSelectMenu]);

  if (itemsCount === 0) return null;

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        {/* Select dropdown like Gmail */}
        <div className="select-dropdown" ref={dropdownRef}>
          <button
            className="toolbar-btn"
            onClick={() => setShowSelectMenu(!showSelectMenu)}
            title="Select"
          >
            <span className="checkbox-icon">
              {allSelected ? '☑' : '☐'}
            </span>
            <span className="dropdown-arrow">▾</span>
          </button>
          {showSelectMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => { onSelectAll(); setShowSelectMenu(false); }}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </div>
              <div className="dropdown-item" onClick={() => { setShowSelectMenu(false); }}>
                Select Read
              </div>
              <div className="dropdown-item" onClick={() => { setShowSelectMenu(false); }}>
                Select Unread
              </div>
            </div>
          )}
        </div>

        {/* Refresh button */}
        <button
          className="toolbar-btn"
          onClick={onRefresh}
          title="Refresh"
          disabled={bulkActionLoading}
        >
          ↻
        </button>
      </div>

      {/* Action buttons - only show when items are selected */}
      {selectedCount > 0 && (
        <div className="toolbar-section toolbar-actions">
          <span className="selection-count">{selectedCount} selected</span>

          <button
            className="toolbar-btn"
            onClick={onMarkAsRead}
            disabled={bulkActionLoading}
            title="Mark as read"
          >
            ✓
          </button>

          <button
            className="toolbar-btn"
            onClick={onMarkAsUnread}
            disabled={bulkActionLoading}
            title="Mark as unread"
          >
            ○
          </button>

          <div className="toolbar-divider"></div>

          <button
            className="toolbar-btn toolbar-btn-danger"
            onClick={onDelete}
            disabled={bulkActionLoading}
            title="Delete"
          >
            🗑
          </button>
        </div>
      )}

      {/* Search on the right */}
      <div className="toolbar-search">
        <Search onSearch={onSearch} placeholder={searchPlaceholder} />
      </div>
    </div>
  );
};

export default BulkActions;
