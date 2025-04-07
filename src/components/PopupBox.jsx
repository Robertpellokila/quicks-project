import React from "react";
import { motion } from "framer-motion";

function PopupBox({ children }) {
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
      <div className="h-full overflow-y-auto">{children}</div>
    </motion.div>
  );
}

export default PopupBox;
