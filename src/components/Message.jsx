import OptionsMenu from "./OptionsMenu";

export default function Message({
  message,
  onEdit,
  onDelete,
  onReply,
  onShare,
  bubbleColor,
  textColor,
}) {
  const isYou = message.sender === "You";

  return (
    <div className={`relative max-w-xs mb-4 ${isYou ? "ml-auto" : ""}`}>
      <div
        className={`text-sm font-semibold mb-1 ${
          isYou ? "text-right pr-2" : "text-left pl-2"
        }`}
        style={{
          color: textColor || (isYou ? "#9B51E0" : "#E5A443"),
        }}
      >
        {message.sender}
      </div>

      <div
        className={`group relative px-3 py-2 rounded-lg text-sm ${
          isYou ? "ml-auto" : ""
        }`}
        style={{
          backgroundColor: bubbleColor || (isYou ? "#EEDCFF" : "#FCEED3"),
          color: "black",
        }}
      >
        {message.replyTo && (
          <div className="mb-2 p-2 bg-white border-l-4 border-purple-300 text-xs rounded">
            Reply to <strong>{message.replyTo.sender}</strong>: "
            {message.replyTo.text}"
          </div>
        )}
        <p>{message.text}</p>
        <span className="block text-xs text-black mt-1">{message.time}</span>

        <div
          className={`absolute top-0 ${
            isYou ? "left-[-36px]" : "right-[-36px]"
          }`}
        >
          {isYou ? (
            <OptionsMenu onEdit={onEdit} onDelete={onDelete} />
          ) : (
            <OptionsMenu onReply={onReply} onShare={onShare} />
          )}
        </div>
      </div>
    </div>
  );
}
