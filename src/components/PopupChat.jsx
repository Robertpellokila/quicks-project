import React, { useState, useEffect } from "react";
import Message from "./Message";
import PopupBox from "./PopupBox";
import SearchInput from "./SearchInput";
import { Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function NewMessageNotification({ onClick }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      onClick={onClick}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 text-center bg-blue-100 text-blue-400 px-4 py-2 rounded-md shadow-lg cursor-pointer text-sm font-bold"
    >
      New Message
    </motion.div>
  );
}

function groupMessagesByDate(messages) {
  const grouped = {};
  messages.forEach((msg) => {
    const date = new Date(msg.date || msg.time).toDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(msg);
  });
  return grouped;
}

export default function PopupChat({
  chats,
  selectedChat,
  onSelectChat,
  onClose,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    selectedChat.messages.push({
      sender: "You",
      text: newMessage,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toISOString(),
    });
    setNewMessage("");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleEditMessage = (index) => {
    const newText = prompt("Edit pesan:", selectedChat.messages[index].text);
    if (newText) {
      const updatedMessages = [...selectedChat.messages];
      updatedMessages[index].text = newText;
      onSelectChat({ ...selectedChat, messages: updatedMessages });
    }
  };

  const handleDeleteMessage = (index) => {
    if (confirm("Hapus pesan ini?")) {
      const updatedMessages = selectedChat.messages.filter(
        (_, i) => i !== index
      );
      onSelectChat({ ...selectedChat, messages: updatedMessages });
    }
  };

  return (
    <PopupBox
      title={
        selectedChat ? (
          selectedChat.type === "group" ? (
            <div>
              <p className="text-blue-600 font-semibold leading-none">
                {selectedChat.groupName || selectedChat.name}
              </p>
              <p className="text-[12px] text-gray-500">
                {selectedChat.participants?.length || 0} Participants
              </p>
            </div>
          ) : (
            <p className="text-blue-600 font-semibold">{selectedChat.name}</p>
          )
        ) : (
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
        )
      }
      onBack={selectedChat ? () => onSelectChat(null) : null}
      onClose={onClose}
      showControls={!!selectedChat}
    >
      {/* List atau Isi Chat */}
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-[22px] pr-2">
          {!selectedChat ? (
            chats && chats.length > 0 ? (
              chats
                .filter(
                  (chat) =>
                    chat.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    chat.lastMessage
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    chat.groupName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => onSelectChat(chat)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      {chat.type === "group" ? (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                          <Users size={18} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-sm">
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        {chat.type === "group" && chat.groupName && (
                          <div className="flex items-center">
                            <p className="text-md text-blue-600 font-semibold mb-0 leading-tight">
                              {chat.groupName}
                            </p>
                            <span className="text-xs text-gray-500 ml-6">
                              {chat.datetime}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <h2 className="text-sm text-gray-900 font-semibold">
                            {chat.name}
                          </h2>
                          {chat.type !== "group" && (
                            <span className="text-xs text-gray-500 ml-6">
                              {chat.datetime}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center mt-10">
                Belum ada pesan.
              </p>
            )
          ) : (
            Object.entries(groupMessagesByDate(selectedChat.messages)).map(
              ([date, messages]) => (
                <div key={date}>
                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-400" />
                    <span className="px-4 text-md font-semibold text-gray-900 whitespace-nowrap">
                      {date}
                    </span>
                    <div className="flex-grow border-t border-gray-900" />
                  </div>

                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      message={msg}
                      onEdit={() => handleEditMessage(index)}
                      onDelete={() => handleDeleteMessage(index)}
                    />
                  ))}
                </div>
              )
            )
          )}
        </div>
        <AnimatePresence>
          {showNotification && (
            <NewMessageNotification
              onClick={() => setShowNotification(false)}
            />
          )}
        </AnimatePresence>

        {/* Input Box jika chat aktif */}
        {selectedChat && (
          <div className="border-t p-3 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a new message"
              className="flex-1 px-3 py-2 border rounded-lg outline-none text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </PopupBox>
  );
}
