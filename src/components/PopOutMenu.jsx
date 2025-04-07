import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Layout, Zap } from "lucide-react";
import chatData from "../data/chatData";
import Button from "./Button";
import PopupChat from "./PopupChat";
import TaskPopup from "./TaskPopup";



export default function PopOutMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const [tasks, setTasks] = useState(null);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setSelectedChat(null);

    setTimeout(() => {
      if (activePopup === "inbox") setSelectedChat(null);
      setActivePopup(null);
      setIsClosing(false);
    }, 100);
  };

  

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900">
      <div className="fixed bottom-6 right-[100px] flex items-center">
        {/* Task dan Inbox (Pop Out Effect) */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 50 }}
          animate={
            isOpen
              ? { scale: 1, opacity: 1, x: 0 }
              : { scale: 0, opacity: 0, x: 50 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-row-reverse space-x-4 space-x-reverse"
        >
          {/* Inbox */}
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Inbox</span>
            <Button
              onClick={() =>
                setActivePopup(activePopup === "inbox" ? null : "inbox")
              }
              icon={MessageSquare}
              className={`flex items-center justify-center rounded-full shadow-lg transition-all ${
                activePopup === "inbox"
                  ? "!bg-purple-500 !text-white !border-purple-500"
                  : "!bg-white !text-purple-500  !border-white"
              }`}
            />
          </div>
          {/* Task */}
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Task</span>
            <Button
              onClick={() =>
                setActivePopup(activePopup === "task" ? null : "task")
              }
              icon={Layout}
              className={`flex items-center justify-center rounded-full shadow-lg transition-all ${
                activePopup === "task"
                  ? "!bg-orange-500 !text-white !border-orange-500"
                  : "!bg-white !text-orange-500  !border-white"
              }`}
            />
          </div>
        </motion.div>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 fixed bottom-6 right-6 flex items-center justify-center "
        >
          <Button icon={Zap} />
        </div>

        <AnimatePresence mode="wait">
          {activePopup === "inbox" && (
            <PopupChat
              key="popup-chat"
              title="Inbox"
              chats={chatData}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
              onClose={handleClose}
            />
          )}
          {activePopup === "task" && (
            <TaskPopup
              key="popup-task"
              title="Task"
              tasks={tasks}
              setTasks={setTasks} // <-- penting ini
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
