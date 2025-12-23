import React from 'react';

const DateCell = ({ date }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <td className="item-date-cell">
      <span className="item-date">{formatDate(date)}</span>
    </td>
  );
};

export default DateCell;
