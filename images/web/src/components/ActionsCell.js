import React from 'react';

const ActionsCell = ({ itemId, onDelete, deleteLoading }) => {
  return (
    <td className="item-actions-cell">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(itemId);
        }}
        className="btn-delete-x"
        disabled={deleteLoading === itemId}
        title="Delete item"
      >
        {deleteLoading === itemId ? '...' : '×'}
      </button>
    </td>
  );
};

export default ActionsCell;
