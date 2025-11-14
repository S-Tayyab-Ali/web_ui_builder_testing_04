"use client";

import React from "react";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className="relative w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
          style={{
            backgroundColor: color,
            boxShadow:
              selectedColor === color
                ? `0 0 0 2px #1a1a1a, 0 0 0 4px ${color}`
                : "none",
          }}
          title={color}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
