"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface CategoryEditorModalProps {
  isOpen: boolean;
  name: string;
  color: string;
  colors: string[];
  isNew: boolean;
  onSave: (name: string, color: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({
  isOpen,
  name,
  color,
  colors,
  isNew,
  onSave,
  onDelete,
  onClose,
}) => {
  const [editName, setEditName] = useState(name);
  const [editColor, setEditColor] = useState(color);

  useEffect(() => {
    setEditName(name);
    setEditColor(color);
  }, [name, color, isOpen]);

  const handleSave = () => {
    if (editName.trim()) {
      onSave(editName.trim(), editColor);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? "Create Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter category name"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Color
            </label>
            <ColorPicker
              colors={colors}
              selectedColor={editColor}
              onColorSelect={setEditColor}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded transition-colors"
            >
              {isNew ? "Create" : "Save"}
            </button>
            {!isNew && onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditorModal;
