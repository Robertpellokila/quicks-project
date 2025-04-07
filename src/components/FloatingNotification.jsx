import { motion, AnimatePresence } from "framer-motion";

export default function FloatingNotification({
  show,
  message = "New Notification",
  onClick,
  className = "",
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          onClick={onClick}
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-600 px-4 py-2 rounded-md shadow text-sm font-bold cursor-pointer z-10 ${className}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
