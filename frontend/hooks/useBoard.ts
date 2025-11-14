"use client";

import { useState, useCallback, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  position: number;
}

const DEFAULT_COLORS = [
  "#FF1744", // Anime Red
  "#F50057", // Hot Pink
  "#D500F9", // Purple
  "#651FFF", // Deep Blue
  "#2979F3", // Blue
  "#00B0FF", // Sky Blue
  "#00E5FF", // Cyan
  "#1DE9B6", // Teal
  "#00E676", // Green
  "#76FF03", // Lime
  "#FFEA00", // Yellow
  "#FFC400", // Amber
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "To Do", color: "#FF1744", position: 0 },
  { id: "2", name: "In Progress", color: "#00B0FF", position: 1 },
  { id: "3", name: "Done", color: "#1DE9B6", position: 2 },
];

export const useBoard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on first load
  useEffect(() => {
    if (!isInitialized) {
      setCategories(DEFAULT_CATEGORIES);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addCategory = useCallback((name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      position: categories.length,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, [categories.length]);

  const updateCategory = useCallback(
    (id: string, name: string, color: string) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, name, color } : cat
        )
      );
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Remove all tasks in this category
    setTasks((prev) => prev.filter((task) => task.categoryId !== id));
  }, []);

  const reorderCategories = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      const newCategories = Array.from(categories);
      const [movedCategory] = newCategories.splice(sourceIndex, 1);
      newCategories.splice(destinationIndex, 0, movedCategory);
      setCategories(
        newCategories.map((cat, index) => ({ ...cat, position: index }))
      );
    },
    [categories]
  );

  const addTask = useCallback((title: string, categoryId: string) => {
    const categoryTasks = tasks.filter((t) => t.categoryId === categoryId);
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      categoryId,
      position: categoryTasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [tasks]);

  const updateTask = useCallback((id: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback(
    (taskId: string, targetCategoryId: string, targetPosition: number) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === taskId);
        if (!task) return prev;

        // Remove task from current position
        let updated = prev.filter((t) => t.id !== taskId);

        // Adjust positions in source category
        updated = updated.map((t) =>
          t.categoryId === task.categoryId && t.position > task.position
            ? { ...t, position: t.position - 1 }
            : t
        );

        // Adjust positions in target category
        updated = updated.map((t) =>
          t.categoryId === targetCategoryId && t.position >= targetPosition
            ? { ...t, position: t.position + 1 }
            : t
        );

        // Update and insert the moved task
        const movedTask = {
          ...task,
          categoryId: targetCategoryId,
          position: targetPosition,
        };
        updated.push(movedTask);

        return updated;
      });
    },
    []
  );

  const reorderTasksInCategory = useCallback(
    (categoryId: string, sourceIndex: number, destinationIndex: number) => {
      setTasks((prev) => {
        const categoryTasks = prev
          .filter((t) => t.categoryId === categoryId)
          .sort((a, b) => a.position - b.position);

        if (sourceIndex === destinationIndex) return prev;

        const [movedTask] = categoryTasks.splice(sourceIndex, 1);
        categoryTasks.splice(destinationIndex, 0, movedTask);

        return prev.map((task) => {
          const newIndex = categoryTasks.findIndex((t) => t.id === task.id);
          if (newIndex !== -1 && task.categoryId === categoryId) {
            return { ...task, position: newIndex };
          }
          return task;
        });
      });
    },
    []
  );

  const getTasksByCategory = useCallback(
    (categoryId: string) => {
      return tasks
        .filter((t) => t.categoryId === categoryId)
        .sort((a, b) => a.position - b.position);
    },
    [tasks]
  );

  const getSortedCategories = useCallback(() => {
    return [...categories].sort((a, b) => a.position - b.position);
  }, [categories]);

  return {
    categories: getSortedCategories(),
    tasks,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasksInCategory,
    getTasksByCategory,
    DEFAULT_COLORS,
  };
};
