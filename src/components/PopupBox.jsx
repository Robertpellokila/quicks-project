import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { hr } from "framer-motion/client";

function PopupBox({ title, onBack, onClose, showControls = true, children }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 25, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: 80, rotateX: 10, scale: 0, pointerEvents: "none" }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="fixed bottom-32 right-6 w-96 h-[30rem] md:w-2xl bg-white p-4 rounded-lg shadow-2xl"
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <div className="absolute -bottom-8 left-0 w-full h-10 opacity-20 blur-md bg-gradient-to-t from-gray-400 to-transparent rounded-b-lg" />
      <div className="flex justify-between items-center pb-2 ">
        <div className="flex items-center gap-2 w-full">
          {showControls && onBack && (
            <button onClick={onBack}>
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
          )}
          <h2 className="text-lg font-semibold w-full text-blue-500">{title}</h2>
        </div>

        {showControls && (
          <button onClick={handleClose}>
            <X className="w-5 h-5 text-black" />
          </button>
        )}
      </div>
      {showControls && <hr />}

      <div className="mt-4 h-[calc(100%-3rem)] overflow-y-auto">{children}</div>
    </motion.div>
  );
}

export default PopupBox;
