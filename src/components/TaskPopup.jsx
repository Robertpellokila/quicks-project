import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNowStrict, format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Trash2,
  Pencil,
  Clock,
  Pen,
} from "lucide-react";
import OptionsMenu from "./OptionsMenu";
import PopupBox from "./PopupBox";
import { taskGroups } from "../data/taskData";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full py-10">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        <p className="text-sm text-gray-600">Loading Task List...</p>
      </div>
    </div>
  );
}

export default function TaskPopup() {
  const [selectedGroup, setSelectedGroup] = useState("my-tasks");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const group = taskGroups.find((g) => g.id === selectedGroup);
      setTasks(group?.tasks || []);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [selectedGroup]);

  const toggleExpand = (id) => {
    setExpandedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleComplete = (id) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = () => {
    const id = Date.now();
    setTasks((prev) => [
      ...prev,
      {
        id,
        ...newTask,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTask({ title: "", dueDate: "", description: "" });
    setShowForm(false);
  };

  const handleDateChange = (id, value) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, dueDate: value } : task))
    );
  };

  return (
    <PopupBox>
      <div className="flex justify-between items-center mb-4 ml-12">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="border text-sm rounded px-2 py-1"
        >
          {taskGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
        >
          + New Task
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const countdown = formatDistanceToNowStrict(
              new Date(task.dueDate),
              { addSuffix: false }
            );
            const isExpanded = expandedTaskIds.includes(task.id);
            const isCompleted = completedTaskIds.includes(task.id);

            return (
              <div
                key={task.id}
                className="p-4 bg-white relative shadow border-b border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleComplete(task.id)}
                      />
                      <h3
                        className={`text-sm font-medium ${
                          isCompleted ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                        {!isCompleted && (
                          <span className="text-red-500 text-xs ml-2">
                            {countdown} Left
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <span className="text-sm text-gray-600">
                      {format(new Date(task.dueDate), "dd/MM/yyyy")}
                    </span>
                    <button onClick={() => toggleExpand(task.id)}>
                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    <OptionsMenu
                      onDelete={() => handleDelete(task.id)}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="ml-6 mt-2">
                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) =>
                          handleDateChange(task.id, e.target.value)
                        }
                        className="border px-2 py-1 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                      <Pencil className="w-5 h-5 text-blue-500" />
                      <p className="text-sm text-gray-700 mt-2">
                        {task.description || "No Description"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {showForm && (
            <div className=" p-4 mb-4  bg-white shadow space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  <Clock className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="border rounded px-3 py-1 text-sm text-gray-700"
                  placeholder="Set Date..."
                />
              </div>

              <div className="flex items-start gap-2">
                <Pencil className="w-4 h-4 text-gray-600 mt-1" />
                <textarea
                  placeholder="No Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-2 py-1 text-sm"
                />
              </div>

              <button
                onClick={handleAddTask}
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
              >
                Save Task
              </button>
            </div>
          )}
        </div>
      )}
    </PopupBox>
  );
}
