<template>
  <div class="container">
    <h1>Task Manager</h1>
    <div id="tasks">
      <div v-for="task in tasks" :key="task._id" class="task">
        <div v-if="!task.editing">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <div class="task-buttons">
            <button @click="deleteTask(task._id)" class="task-button task-button-delete">Delete</button>
            <button @click="startEditing(task)" class="task-button task-button-edit">Edit</button>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="saveEditedTask(task)">
            <input type="text" v-model="task.updatedTitle" placeholder="Task Title" required>
            <input type="text" v-model="task.updatedDescription" placeholder="Task Description">
            <button type="submit" class="task-button task-button-edit">Save</button>
            <button @click="cancelEditing(task)" class="task-button task-button-delete">Cancel</button>
          </form>
        </div>
      </div>
    </div>
    <form @submit.prevent="addTask" class="form">
      <input type="text" v-model="newTask.title" placeholder="Task Title" required>
      <input type="text" v-model="newTask.description" placeholder="Task Description">
      <button type="submit">Add Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tasks = ref([]);
const newTask = ref({ title: '', description: '' });

const fetchTasks = async () => {
  try {
    const response = await axios.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const addTask = async () => {
  try {
    const response = await axios.post('/tasks', newTask.value);
    tasks.value.push(response.data);
    newTask.value.title = '';
    newTask.value.description = '';
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

const deleteTask = async (taskId) => {
  try {
    await axios.delete(`/tasks/${taskId}`);
    tasks.value = tasks.value.filter(task => task._id !== taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

const updateTask = async (task) => {
  try {
    const response = await axios.put(`/tasks/${task._id}`, task);
    const updatedTaskIndex = tasks.value.findIndex(t => t._id === task._id);
    if (updatedTaskIndex !== -1) {
      tasks.value[updatedTaskIndex] = response.data;
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const startEditing = (task) => {
  task.editing = true;
  task.updatedTitle = task.title;
  task.updatedDescription = task.description;
};

const saveEditedTask = async (task) => {
  task.title = task.updatedTitle;
  task.description = task.updatedDescription;
  task.editing = false;
  updateTask(task)
};

const cancelEditing = (task) => {
  task.editing = false;
};

onMounted(fetchTasks);
</script>

<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}

#tasks {
    margin-top: 20px;
}

.task {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.task h3 {
    color: #333;
}

.task p {
    color: #666;
    margin-top: 5px;
}

.task-buttons {
    margin-top: 10px;
}

.task-button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.task-button-delete {
    background-color: #e74c3c;
    color: #fff;
}

.task-button-edit {
    background-color: #3498db;
    color: #fff;
}

form {
    margin-top: 20px;
    display: flex; /* Use flexbox */
}

form input[type="text"] {
    flex: 1; /* Take remaining space */
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-right: 10px; /* Add right margin */
}

form button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #2ecc71;
    color: #fff;
    cursor: pointer;
}

</style>

