import { useState } from "react";
import PopupBox from "./PopupBox";
import OptionsMenu from "./OptionsMenu";
import { CalendarDays, Pencil } from "lucide-react";

export default function TaskPopup({ tasks, setTasks, onClose }) {
  const handleToggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const handleEdit = (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
      const updated = [...tasks];
      updated[index].text = newText;
      setTasks(updated);
    }
  };

  const handleDelete = (index) => {
    if (confirm("Hapus task ini?")) {
      const updated = tasks.filter((_, i) => i !== index);
      setTasks(updated);
    }
  };

  const handleAddTask = () => {
    const newText = prompt("Tambah task baru:");
    if (newText) {
      const newTask = {
        text: newText,
        done: false,
        date: new Date().toLocaleDateString("en-GB"), // contoh: 07/04/2025
        description: "No Description",
      };
      setTasks([newTask, ...tasks]);
    }
  };

  return (
    <PopupBox title="My Tasks" onClose={onClose}>
      <div className="flex justify-between items-center px-4 pt-2 pb-1">
        <h2 className="text-sm font-semibold text-gray-700">My Tasks</h2>
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          New Task
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y">
        {tasks.length > 0 ? (
          tasks.map((task, i) => (
            <div
              key={i}
              className="p-4 flex flex-col gap-2 group hover:bg-gray-50 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleDone(i)}
                    className="mt-1"
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        task.done ? "line-through text-gray-500" : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </p>

                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <CalendarDays size={12} />
                      <span>{task.date}</span>
                      {task.description && (
                        <>
                          <span className="mx-2">|</span>
                          <span>{task.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-3">
                  <OptionsMenu
                    onEdit={() => handleEdit(i)}
                    onDelete={() => handleDelete(i)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">Belum ada tugas.</p>
        )}
      </div>
    </PopupBox>
  );
}
