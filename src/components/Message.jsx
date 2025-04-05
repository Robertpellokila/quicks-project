import OptionsMenu from "./OptionsMenu";

export default function Message({ message, onEdit, onDelete }) {
  const isYou = message.sender === "You";

  return (
    <div className={`relative max-w-xs mb-4 ${isYou ? "ml-auto" : ""}`}>
      <div
        className={`text-sm font-semibold mb-1 ${
          isYou
            ? "text-right pr-2 text-[#9B51E0] "
            : "text-left pl-2 text-[#E5A443]"
        }`}
      >
        {message.sender}
      </div>

      <div
        className={`group relative px-3 py-2 rounded-lg text-sm ${
          isYou ? "bg-[#EEDCFF] text-black ml-auto" : "bg-[#FCEED3] text-black"
        }`}
      >
        <p>{message.text}</p>
        <span className="block text-xs text-black mt-1">{message.time}</span>

        <div
          className={`absolute top-0 ${
            isYou ? "left-[-36px]" : "right-[-36px]"
          }`}
        >
          <OptionsMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
