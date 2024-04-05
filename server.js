require('dotenv').config(); // import .env
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Serve static files from the Vue.js client build directory
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Body parser middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

// API routes
// List task
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Push task
app.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve Vue.js application for any other routes (e.g., '/')
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'task-manager-client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

