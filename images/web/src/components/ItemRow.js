import React from 'react';
import HighlightCell from './HighlightCell';
import SourceLink from './SourceLink';
import TagCircle from './TagCircle';

const ItemRow = ({
  item,
  isExpanded,
  isSelected,
  onToggle,
  onDelete,
  onSelect,
  deleteLoading,
  searchQuery
}) => {
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  return (
    <tr
      key={item.id}
      className={`item-row ${isExpanded ? 'expanded' : ''} ${!item.is_read ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggle(item.id)}
    >
      <td className="checkbox-col" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxClick}
        />
      </td>
      <HighlightCell itemId={item.id} content={item.content} searchQuery={searchQuery} />
      <td className="item-tags-cell">
        {item.tags && item.tags.length > 0 ? (
          <div className="item-tags-circles">
            {item.tags.filter(tag => tag && tag.id && tag.name).map((tag) => (
              <TagCircle key={tag.id} tag={tag} showName={false} />
            ))}
          </div>
        ) : (
          <span className="no-tags">—</span>
        )}
      </td>
      <SourceLink url={item.url} />
    </tr>
  );
};

export default ItemRow;
