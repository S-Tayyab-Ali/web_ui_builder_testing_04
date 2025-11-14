"use client";

import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  position: number;
}

interface CategoryColumnProps {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditCategory: () => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, categoryId: string) => void;
  onDragEnd: () => void;
}

const CategoryColumn: React.FC<CategoryColumnProps> = ({
  id,
  name,
  color,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditCategory,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTask();
    if (e.key === "Escape") {
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      className="flex flex-col w-80 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors"
    >
      {/* Column Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          borderBottom: `2px solid ${color}`,
        }}
      >
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <span className="text-xs text-gray-400 ml-auto">{tasks.length}</span>
        </div>
        <button
          onClick={onEditCategory}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-300" />
        </button>
      </div>

      {/* Tasks Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <TaskCard
              id={task.id}
              title={task.title}
              onEdit={(newTitle) => onEditTask(task.id, newTitle)}
              onDelete={() => onDeleteTask(task.id)}
            />
          </div>
        ))}

        {/* New Task Input */}
        {isAddingTask ? (
          <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
            <input
              autoFocus
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onBlur={handleAddTask}
              onKeyDown={handleKeyDown}
              placeholder="Add a task..."
              className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm placeholder-gray-500"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full py-2 px-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add task</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryColumn;
