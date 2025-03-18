const API_URL = 'http://localhost:5000/api';

// Auth API calls
export const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Task API calls
export const getTasks = async (token) => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createTask = async (token, taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const updateTask = async (token, taskId, updates) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteTask = async (token, taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}; 