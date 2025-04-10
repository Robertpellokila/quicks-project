import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import ButtonTrigger from "./ButtonTrigger";

export default function CustomModal({
  isOpen,
  title,
  description,
  inputType = "textarea",
  initialValue = "",
  confirmText = "OK",
  cancelText = "Cancel",
  showInput = false,
  onClose,
  onConfirm,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) setValue(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4 z-[100]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white rounded-2xl w-full max-w-sm shadow-xl space-y-4"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}

            {showInput && (
              <>
                {inputType === "textarea" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                    rows={4}
                  />
                ) : (
                  <input
                    type={inputType}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                )}
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm(value);
                  onClose();
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
                >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
