import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import PopupBox from "./PopupBox";
import SearchInput from "./SearchInput";
import FloatingNotification from "./FloatingNotification";
import { Users, ArrowLeft, X } from "lucide-react";
import ButtonTrigger from "./ButtonTrigger";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full py-10">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        <p className="text-sm text-gray-600">Loading chats...</p>
      </div>
    </div>
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
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  useEffect(() => {
    if (selectedChat) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedChat]);

  return (
    <PopupBox>
      <div className="flex flex-col h-full relative">
        {/* HEADER */}
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center gap-2 w-full">
            {selectedChat && (
              <button onClick={() => onSelectChat(null)}>
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
            )}
            <div className="flex-1">
              {selectedChat ? (
                selectedChat.type === "group" ? (
                  <div>
                    <p className="text-blue-600 font-semibold leading-none">
                      {selectedChat.groupName || selectedChat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedChat.participants?.length || 0} Participants
                    </p>
                  </div>
                ) : (
                  <p className="text-blue-600 font-semibold">
                    {selectedChat.name}
                  </p>
                )
              ) : (
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                />
              )}
            </div>
          </div>

          {selectedChat && (
            <button onClick={onClose}>
              <X className="w-5 h-5 text-black" />
            </button>
          )}
        </div>

        <hr className="mb-3" />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-[22px] pr-2">
          {!selectedChat ? (
            loading ? (
              <LoadingSpinner />
            ) : chats && chats.length > 0 ? (
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
                      {chat.type === "group" ? (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                          <Users size={18} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-sm">
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                      )}
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

                  {messages.map((msg, index) => {
                    const isMe = msg.sender === "You";

                    return (
                      <Message
                        key={index}
                        message={msg}
                        bubbleColor={
                          !isMe && msg.BubbleColor ? msg.BubbleColor : undefined
                        }
                        textColor={
                          !isMe && msg.TextColor ? msg.TextColor : undefined
                        }
                        onEdit={() => handleEditMessage(index)}
                        onDelete={() => handleDeleteMessage(index)}
                      />
                    );
                  })}
                </div>
              )
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* NOTIFICATION */}
        <FloatingNotification
          show={showNotification}
          message="New Message"
          onClick={() => {
            setShowNotification(false);
            setTimeout(scrollToBottom, 300);
          }}
        />

        {/* INPUT */}
        {selectedChat && (
          <div className="border-t p-3 flex items-center gap-2 relative z-[99]">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a new message"
              className="flex-1 px-3 py-2 border rounded-lg outline-none text-sm relative z-20"
            />
            <ButtonTrigger 
              
                title="Send"
                onclick={handleSend}
                
            />
          </div>
        )}
      </div>
    </PopupBox>
  );
}
