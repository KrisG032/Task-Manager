// API URL
const API_URL = 'http://localhost:5000/api';

// Tasks array
let tasks = [];

// Function to fetch tasks from the server
async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        tasks = await response.json();
        filterAndSortTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please try again.');
    }
}

// Function to update task count
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const taskCount = document.getElementById('taskCount');
    taskCount.textContent = `${completedTasks}/${totalTasks} tasks completed`;
}

// Function to filter and sort tasks
function filterAndSortTasks() {
    const filterStatus = document.getElementById('filterStatus').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    // First, filter the tasks
    let filteredTasks = [...tasks];
    if (filterStatus === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filterStatus === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    // Then, sort the tasks
    filteredTasks.sort((a, b) => {
        if (sortOrder === 'deadline-asc') {
            // Handle tasks without deadlines
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortOrder === 'deadline-desc') {
            // Handle tasks without deadlines
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(b.deadline) - new Date(a.deadline);
        }
        // Default to the order they were added
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    renderTasks(filteredTasks);
}

// Function to render tasks
function renderTasks(tasksToRender = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasksToRender.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const deadline = task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline';
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}', this.checked)">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description || ''}</div>
                <div class="task-deadline">
                    <i class="fas fa-clock"></i> ${deadline}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask('${task._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
    
    updateTaskCount();
}

// Function to add a new task
async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const deadline = document.getElementById('taskDeadline').value;
    
    if (!title) return;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                deadline,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskDeadline').value = '';
        
        await fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
    }
}

// Function to toggle task completion
async function toggleTask(taskId, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        await fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Function to edit task
async function editTask(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const newTitle = prompt('Edit task title:', task.title);
    if (!newTitle) return;
    
    const newDescription = prompt('Edit task description:', task.description || '');
    
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        await fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Function to delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        await fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

// Initialize the app
fetchTasks(); 