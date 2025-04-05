import PopupBox from "./PopupBox";

export default function TaskPopup({ tasks, onClose }) {
  return (
    <PopupBox title="Task" onClose={onClose}>
      {tasks.length > 0 ? (
        tasks.map((task, i) => (
          <div key={i} className="p-2 border-b flex items-center">
            <input type="checkbox" checked={task.done} readOnly className="mr-2" />
            <span className={task.done ? "line-through text-gray-500" : ""}>
              {task.text}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Belum ada tugas.</p>
      )}
    </PopupBox>
  );
}
