import React from 'react';

const COLORS = [
  { value: '#1e7ea5', name: 'Blue' },
  { value: '#17416e', name: 'Dark Blue' },
  { value: '#e47d88', name: 'Pink' },
  { value: '#f17e5d', name: 'Orange-Red' },
  { value: '#f6b84e', name: 'Orange' },
  { value: '#fff9e6', name: 'Cream' },
  { value: '#7fd0b8', name: 'Mint' },
  { value: '#9ea3f1', name: 'Lavender' },
  { value: '#d3a9c7', name: 'Light Pink' },
  { value: '#f9f5ff', name: 'Very Light Purple' }
];

const ColorPicker = ({ selectedColor, onColorSelect, label }) => {
  return (
    <div className="color-picker">
      <label>{label}</label>
      <div className="color-grid">
        {COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.value)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
export { COLORS };
