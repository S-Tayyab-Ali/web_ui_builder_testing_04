"use client";

import React, { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  onEdit: (newTitle: string) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isHovering, setIsHovering] = useState(false);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-700">
        <input
          autoFocus
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>
    );
  }

  return (
    <div
      draggable
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`bg-gray-800 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-all duration-200 border border-gray-700 hover:border-gray-600 ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {isHovering && (
          <GripVertical className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p
            onClick={() => setIsEditing(true)}
            className="text-white text-sm break-words cursor-text hover:text-gray-300 transition-colors"
          >
            {title}
          </p>
        </div>
        {isHovering && (
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
