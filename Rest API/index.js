const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const Task = require("./models/Task");

const app = express();
app.use(cors());
app.use(express.json());


app.post("/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});


app.get("/tasks", async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});


app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  res.json(task);
});


app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { completed } = req.body;
  task.completed = completed;
  await task.save();
  res.json(task);
});


app.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  await task.destroy();
  const tasks = await Task.findAll();

  res.json({
    message: "Task deleted successfully",
    tasks: tasks
  });
});


sequelize.sync().then(() => {
  app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  );
});