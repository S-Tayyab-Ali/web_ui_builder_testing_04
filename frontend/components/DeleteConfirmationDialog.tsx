"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
            <p className="text-sm text-gray-400 mb-6">{description}</p>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className={`flex-1 font-medium py-2 px-3 rounded transition-colors ${
                  isDangerous
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded transition-colors"
              >
                {cancelText}
              </button>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
