const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Свързване с MongoDB
const connectionString = 'mongodb+srv://alekskg1993:0875@to-do-list.fmzn5.mongodb.net/?retryWrites=true&w=majority&appName=To-Do-List'; // Замести с твоя Connection String

mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas', err);
    });

// Определяне на схема и модел
const taskSchema = new mongoose.Schema({
    text: String,
    date: String,
    time: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// API маршрути

// Получаване на всички задачи
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Добавяне на нова задача
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// Изтриване на задача
app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted' });
});

// Промяна на статуса на задача
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    task.completed = !task.completed; // Превключване на статус
    await task.save();
    res.json(task);
});

// Стартиране на сървъра
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});