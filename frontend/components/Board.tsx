"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useBoard, Task, Category } from "@/hooks/useBoard";
import CategoryColumn from "./CategoryColumn";
import CategoryEditorModal from "./CategoryEditorModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Board: React.FC = () => {
  const {
    categories,
    tasks,
    addCategory,
    updateCategory,
    deleteCategory,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByCategory,
    DEFAULT_COLORS,
  } = useBoard();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    isNew: boolean;
    name: string;
    color: string;
  }>({
    isOpen: false,
    categoryId: null,
    isNew: false,
    name: "",
    color: DEFAULT_COLORS[0],
  });

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    categoryId: string | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  const handleOpenNewCategoryEditor = () => {
    setEditorState({
      isOpen: true,
      categoryId: null,
      isNew: true,
      name: "",
      color: DEFAULT_COLORS[0],
    });
  };

  const handleOpenCategoryEditor = (category: Category) => {
    setEditorState({
      isOpen: true,
      categoryId: category.id,
      isNew: false,
      name: category.name,
      color: category.color,
    });
  };

  const handleSaveCategory = (name: string, color: string) => {
    if (editorState.isNew) {
      addCategory(name, color);
    } else if (editorState.categoryId) {
      updateCategory(editorState.categoryId, name, color);
    }
    setEditorState({ ...editorState, isOpen: false });
  };

  const handleDeleteCategory = () => {
    if (editorState.categoryId) {
      setDeleteState({
        isOpen: true,
        categoryId: editorState.categoryId,
      });
      setEditorState({ ...editorState, isOpen: false });
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (deleteState.categoryId) {
      deleteCategory(deleteState.categoryId);
      setDeleteState({ isOpen: false, categoryId: null });
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string
  ) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (draggedTaskId) {
      const targetCategoryTasks = getTasksByCategory(targetCategoryId);
      const targetPosition = targetCategoryTasks.length;
      moveTask(draggedTaskId, targetCategoryId, targetPosition);
      setDraggedTaskId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Todo Board</h1>
        <p className="text-gray-400">Organize your tasks with style</p>
      </div>

      {/* Main Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {categories.map((category) => (
          <CategoryColumn
            key={category.id}
            id={category.id}
            name={category.name}
            color={category.color}
            tasks={getTasksByCategory(category.id)}
            onAddTask={(title) => addTask(title, category.id)}
            onEditTask={updateTask}
            onDeleteTask={deleteTask}
            onEditCategory={() => handleOpenCategoryEditor(category)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}

        {/* Add Column Button */}
        <button
          onClick={handleOpenNewCategoryEditor}
          className="flex-shrink-0 w-80 bg-gray-800 hover:bg-gray-700 rounded-xl border-2 border-dashed border-gray-700 hover:border-gray-600 flex items-center justify-center transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-gray-700 group-hover:bg-gray-600 rounded-lg transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </div>
            <span className="text-gray-400 group-hover:text-white font-medium">
              Add Column
            </span>
          </div>
        </button>
      </div>

      {/* Modals */}
      <CategoryEditorModal
        isOpen={editorState.isOpen}
        name={editorState.name}
        color={editorState.color}
        colors={DEFAULT_COLORS}
        isNew={editorState.isNew}
        onSave={handleSaveCategory}
        onDelete={editorState.isNew ? undefined : handleDeleteCategory}
        onClose={() => setEditorState({ ...editorState, isOpen: false })}
      />

      <DeleteConfirmationDialog
        isOpen={deleteState.isOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? All tasks in this category will be removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setDeleteState({ isOpen: false, categoryId: null })}
      />
    </div>
  );
};

export default Board;
