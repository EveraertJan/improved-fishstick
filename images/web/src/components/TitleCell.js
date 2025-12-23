import React from 'react';
import { useNavigate } from 'react-router-dom';

const TitleCell = ({ itemId, title }) => {
  const navigate = useNavigate();

  return (
    <td className="item-title-cell">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/item/${itemId}`);
        }}
        className="title-link"
      >
        {title || 'Untitled'}
      </button>
    </td>
  );
};

export default TitleCell;
