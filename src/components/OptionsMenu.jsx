import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OptionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setOpen((prev) => !prev)}>
        <MoreHorizontal className="w-4 h-4 text-gray-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 z-10 mt-1 w-28 bg-white border border-gray-300 rounded shadow-md text-sm overflow-hidden"
          >
            <button
              onClick={() => {
                onEdit?.();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-blue-500 border-b border-gray-300"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete?.();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 hover:bg-red-100 text-left text-red-600"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
