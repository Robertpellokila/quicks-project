import React from "react";
import { motion } from "framer-motion";

function PopupBox({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 25, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: 80, rotateX: 10, scale: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="fixed bottom-32 right-6 z-50 md:w-[40rem] sm:w-[28rem] h-[30rem] bg-white rounded-xl shadow-xl overflow-hidden p-4"
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}

export default PopupBox;
