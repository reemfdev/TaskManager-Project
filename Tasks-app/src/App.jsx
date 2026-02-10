import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [openTaskId, setOpenTaskId] = useState(null); // أي مهمة مفتوحة

  // Fetch tasks from API
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task
  const addTask = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        completed: false,
      }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTitle("");
        setNewDescription("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // Toggle task completion
  const toggleTask = (id, completed) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks))
      .catch((err) => console.error("Error deleting task:", err));
  };

  // Toggle description visibility
  const toggleDropdown = (id) => {
    setOpenTaskId(openTaskId === id ? null : id);
  };

  return (
    <div className="task-app">
      <h1>Tasks App</h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="Task Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div className="task-main">
              <span onClick={() => toggleTask(task.id, task.completed)}>
                {task.title}
              </span>
              <div className="task-buttons">
                <button onClick={() => toggleDropdown(task.id)}>
                  Show Details
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>

            {openTaskId === task.id && (
              <div className="task-description">{task.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;