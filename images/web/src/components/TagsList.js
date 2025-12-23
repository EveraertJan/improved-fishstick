import React from 'react';

const TagsList = ({ tags }) => {
  return (
    <td className="item-tags-cell">
      {tags && tags.length > 0 ? (
        <div className="item-tags">
          {tags.filter(tag => tag && tag.id && tag.name).map((tag) => (
            <span key={tag.id} className="item-tag">
              {tag.name}
            </span>
          ))}
        </div>
      ) : (
        <span className="no-tags">No tags</span>
      )}
    </td>
  );
};

export default TagsList;
