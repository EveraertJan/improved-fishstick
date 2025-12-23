import React from 'react';
import ItemRow from './ItemRow';

const ItemsTable = ({
  items,
  expandedRows,
  selectedItems,
  onToggleRow,
  onDelete,
  onSelectItem,
  onSelectAll,
  deleteLoading,
  searchQuery
}) => {
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  return (
    <table className="items-table">
      <thead>
        <tr>
          <th className="checkbox-col">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              onClick={(e) => e.stopPropagation()}
            />
          </th>
          <th>Highlight</th>
          <th>Tags</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isExpanded={expandedRows.has(item.id)}
            isSelected={selectedItems.has(item.id)}
            onToggle={onToggleRow}
            onDelete={onDelete}
            onSelect={onSelectItem}
            deleteLoading={deleteLoading}
            searchQuery={searchQuery}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ItemsTable;
