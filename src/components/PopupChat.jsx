import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import PopupBox from "./PopupBox";
import SearchInput from "./SearchInput";
import FloatingNotification from "./FloatingNotification";
import { Users, ArrowLeft, X } from "lucide-react";
import ButtonTrigger from "./ButtonTrigger";
import CustomModal from "./CustomModal";

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
    const dateStr = msg.date || msg.datetime;
    if (!dateStr) return;
    const dateKey = new Date(dateStr).toDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(msg);
  });
  return grouped;
}

function formatChatDatetime(datetimeString) {
  const date = new Date(datetimeString);
  const today = new Date();

  const isToday = date.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;

  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + `, ${time}`
  );
}

function getDateSeparator(dateString) {
  const today = new Date();
  const date = new Date(dateString);

  const isToday = date.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  // Format: Monday, 7 April 2025
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
  
    const newMsg = {
      sender: "You",
      text: newMessage,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toISOString(),
    };
  
    // Jika sedang reply
    if (replyTo) {
      newMsg.replyTo = {
        sender: replyTo.sender,
        text: replyTo.text,
      };
    }
  
    selectedChat.messages.push(newMsg);
    setNewMessage("");
    setReplyTo(null); // reset reply setelah kirim
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  

  const handleEditMessage = (index) => setEditingIndex(index);
  const handleDeleteMessage = (index) => setDeletingIndex(index);

  const handleReplyMessage = (msg) => {
    setReplyTo(msg);
    setNewMessage(`@${msg.sender}: `); // bisa diganti sesuai logika mention
  };

  const handleShareMessage = (msg) => {
    console.log("Sharing message:", msg.text);
    alert("Fitur share belum tersedia.");
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
    <>
      {/* Modal Edit Message */}
      <CustomModal
        isOpen={editingIndex !== null}
        title="Edit Pesan"
        showInput={true}
        inputType="textarea"
        initialValue={
          editingIndex !== null ? selectedChat.messages[editingIndex]?.text : ""
        }
        confirmText="Simpan"
        cancelText="Batal"
        onClose={() => setEditingIndex(null)}
        onConfirm={(newText) => {
          const updatedMessages = [...selectedChat.messages];
          updatedMessages[editingIndex].text = newText;
          onSelectChat({ ...selectedChat, messages: updatedMessages });
        }}
      />

      {/* Modal Delete Confirmation */}
      <CustomModal
        isOpen={deletingIndex !== null}
        title="Hapus Pesan"
        description="Apakah Anda yakin ingin menghapus pesan ini?"
        showInput={false}
        confirmText="Hapus"
        cancelText="Batal"
        onClose={() => setDeletingIndex(null)}
        onConfirm={() => {
          const updatedMessages = selectedChat.messages.filter(
            (_, i) => i !== deletingIndex
          );
          onSelectChat({ ...selectedChat, messages: updatedMessages });
        }}
      />

      <PopupBox>
        <div className="flex flex-col h-full w-full ">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
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
                                {formatChatDatetime(chat.datetime)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <h2 className="text-sm text-gray-900 font-semibold">
                              {chat.name}
                            </h2>
                            {chat.type !== "group" && (
                              <span className="text-xs text-gray-500 ml-6">
                                {formatChatDatetime(chat.datetime)}
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
                        {getDateSeparator(date)}
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
                            !isMe && msg.BubbleColor
                              ? msg.BubbleColor
                              : undefined
                          }
                          textColor={
                            !isMe && msg.TextColor ? msg.TextColor : undefined
                          }
                          onEdit={
                            isMe ? () => handleEditMessage(index) : undefined
                          }
                          onDelete={
                            isMe ? () => handleDeleteMessage(index) : undefined
                          }
                          onReply={
                            !isMe ? () => handleReplyMessage(msg) : undefined
                          }
                          onShare={
                            !isMe ? () => handleShareMessage(msg) : undefined
                          }
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
          {replyTo && (
            <div className="flex items-start justify-between p-2 mb-2 bg-gray-100 border-l-4 border-blue-500 rounded shadow-sm">
              <div>
                <p className="text-xs text-blue-600 font-semibold">
                  {replyTo.sender}
                </p>
                <p className="text-sm text-gray-800 truncate max-w-xs">
                  {replyTo.text}
                </p>
              </div>
              <button
                className="text-gray-500 hover:text-red-500 text-xs ml-4"
                onClick={() => setReplyTo(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* INPUT */}
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
              <ButtonTrigger title="Send" onclick={handleSend} />
            </div>
          )}
        </div>
      </PopupBox>
    </>
  );
}
