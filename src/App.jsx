import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("👩‍💻 Work");
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("balanziaTasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("balanziaTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [...tasks, { category, text: newTask, done: false }];
    setTasks(updated);
    setNewTask("");
  };

  const confirmDelete = () => {
    setDeletingIndex(pendingDeleteIndex);
    setShowConfirm(false);
    setTimeout(() => {
      const updated = tasks.filter((_, i) => i !== pendingDeleteIndex);
      setTasks(updated);
      setDeletingIndex(null);
      setPendingDeleteIndex(null);
    }, 500);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setPendingDeleteIndex(null);
  };

  const toggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const categoryOrder = [
    "🪷 You",
    "👩‍💻 Work",
    "🧒 Kids",
    "🏡 Home",
    "💌 Relationship",
  ];

  return (
    <div className="App">
      <h1>🕊️ Balanzia</h1>
      <p>Your calm dashboard for today’s juggle</p>

      <div className="task-form">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryOrder.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />

        <button onClick={addTask}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {categoryOrder.map((cat) => {
        const tasksInCategory = tasks
          .map((task, index) => ({ ...task, index }))
          .filter((task) => task.category === cat);

        if (tasksInCategory.length === 0) return null;

        return (
          <div key={cat}>
            <div className="category-title">{cat}</div>
            <ul>
              {tasksInCategory.map((task) => (
                <li
                  key={task.index}
                  className={`task-item${task.index === deletingIndex ? " deleting" : ""}`}
                >
                  <div className="task-left">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleDone(task.index)}
                      className="done-checkbox"
                    />
                    <span className={`task-text ${task.done ? "done" : ""}`}>
                      {task.text}
                    </span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      setPendingDeleteIndex(task.index);
                      setShowConfirm(true);
                    }}
                    aria-label="Delete task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
