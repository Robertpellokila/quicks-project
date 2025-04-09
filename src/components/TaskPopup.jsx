import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, format } from "date-fns";
import { ChevronDown, ChevronUp, Pencil, Clock } from "lucide-react";
import OptionsMenu from "./OptionsMenu";
import PopupBox from "./PopupBox";
import { taskGroups as initialTaskGroups } from "../data/taskData";
import ButtonTrigger from "./ButtonTrigger";
import CustomModal from "./CustomModal";

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
  const [taskGroups, setTaskGroups] = useState(() => {
    const groupMap = {};
    initialTaskGroups.forEach((group) => {
      groupMap[group.id] = group.tasks;
    });
    return groupMap;
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingDateTaskId, setEditingDateTaskId] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setTasks(taskGroups[selectedGroup] || []);
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

  const handleAddTask = () => {
    if (
      !newTask.title.trim() ||
      !newTask.dueDate ||
      !newTask.description.trim()
    ) {
      setFormError(
        "Please fill in all fields (Title, Due Date, and Description)"
      );
      return;
    }

    setFormError("");

    const taskToAdd = {
      id: Date.now(),
      title: newTask.title,
      dueDate: newTask.dueDate,
      description: newTask.description,
      completed: false,
    };

    const updatedTasks = [...(taskGroups[selectedGroup] || []), taskToAdd];
    const updatedGroups = {
      ...taskGroups,
      [selectedGroup]: updatedTasks,
    };

    setTaskGroups(updatedGroups);
    setTasks(updatedTasks);
    setNewTask({ title: "", dueDate: "", description: "" });
    setShowForm(false);
  };

  const handleDateChange = (id, value) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, dueDate: value } : task
    );
    setTasks(updatedTasks);
    setTaskGroups({ ...taskGroups, [selectedGroup]: updatedTasks });
  };

  const handleDescriptionChange = (id, value) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, description: value } : task
    );
    setTasks(updatedTasks);
    setTaskGroups({ ...taskGroups, [selectedGroup]: updatedTasks });
  };

  const handleDeleteConfirm = () => {
    const updatedTasks = tasks.filter((task) => task.id !== taskIdToDelete);
    setTasks(updatedTasks);
    setTaskGroups({ ...taskGroups, [selectedGroup]: updatedTasks });
    setTaskIdToDelete(null);
  };

  return (
    <>
      <CustomModal
        isOpen={taskIdToDelete !== null}
        onClose={() => setTaskIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={"Hapus Tugas"}
        description={"Yakin ingin menghapus task ini?"}
      />

      <PopupBox>
        <div className="flex flex-col h-[70vh]">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white py-2 px-4 border-b flex justify-between items-center">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="border text-sm rounded px-2 py-1"
            >
              {initialTaskGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <ButtonTrigger
              onclick={() => setShowForm(true)}
              title={"+ New Task"}
            />
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto px-4 py-2 space-y-4 flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {tasks.map((task) => {
                  const dueDate = new Date(task.dueDate);
                  const now = new Date();
                  const isOverdue = dueDate < now;

                  const countdown = formatDistanceToNowStrict(dueDate, {
                    addSuffix: false,
                  });

                  const countdownText = isOverdue
                    ? ` ${countdown} ago`
                    : `${countdown} left`;

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
                                <span
                                  className={`text-xs ml-2 ${
                                    isOverdue
                                      ? "text-red-600 font-semibold"
                                      : "text-red-500"
                                  }`}
                                >
                                  {countdownText}
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
                            onDelete={() => setTaskIdToDelete(task.id)}
                          />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="ml-6 mt-2">
                          <div
                            className="flex items-center gap-2 mt-2 text-gray-600 text-sm cursor-pointer"
                            onClick={() => setEditingDateTaskId(task.id)}
                          >
                            <Clock className="w-5 h-5 text-blue-500 hover:scale-120" />
                            {editingDateTaskId === task.id ? (
                              <input
                                type="date"
                                value={task.dueDate}
                                onChange={(e) =>
                                  handleDateChange(task.id, e.target.value)
                                }
                                onBlur={() => setEditingDateTaskId(null)}
                                className="border px-2 py-1 rounded text-sm"
                                autoFocus
                              />
                            ) : (
                              <span className="text-sm text-gray-700">
                                {format(
                                  new Date(task.dueDate),
                                  "dd/MM/yyyy"
                                )}
                              </span>
                            )}
                          </div>

                          <div
                            className="flex items-start gap-2 mt-2 text-gray-600 text-sm cursor-pointer"
                            onClick={() => setEditingTaskId(task.id)}
                          >
                            <Pencil className="w-5 h-5 text-blue-500 mt-1 hover:scale-120" />
                            {editingTaskId === task.id ? (
                              <textarea
                                className="w-full px-2 py-1 border rounded text-sm"
                                value={task.description}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    task.id,
                                    e.target.value
                                  )
                                }
                                onBlur={() => setEditingTaskId(null)}
                                autoFocus
                              />
                            ) : (
                              <p className="text-sm text-gray-700">
                                {task.description ||
                                  "Klik untuk menambahkan deskripsi"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {showForm && (
                  <div className="p-4 mb-4 bg-white shadow space-y-3">
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
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm"
                      />
                    </div>
                    {formError && (
                      <div className="text-red-500 text-sm">{formError}</div>
                    )}
                    <ButtonTrigger onclick={handleAddTask} title={"Save Task"} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopupBox>
    </>
  );
}
