import React, { useState } from 'react';

const TagCircle = ({ tag, showName = false, isActive = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color1 = tag.color1 || '#1e7ea5';
  const color2 = tag.color2 || '#17416e';

  const shouldShowName = showName || isHovered;

  return (
    <div
      className={`tag-circle-wrapper ${isActive ? 'tag-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="tag-circle"
        style={{
          background: `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`
        }}
        title={tag.name}
      />
      {/*{shouldShowName && <span className="tag-name">{tag.name}</span>}*/}
    </div>
  );
};

export default TagCircle;
