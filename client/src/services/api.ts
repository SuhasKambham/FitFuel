import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  return res.data;
}

export async function getWorkoutAnalytics(token: string) {
  const res = await axios.get(`${API_BASE}/workouts/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMealAnalytics(token: string) {
  const res = await axios.get(`${API_BASE}/meals/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getWorkouts(token: string) {
  const res = await axios.get(`${API_BASE}/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addWorkout(token: string, workout: any) {
  const res = await axios.post(`${API_BASE}/workouts`, workout, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateWorkout(token: string, id: string, workout: any) {
  const res = await axios.put(`${API_BASE}/workouts/${id}`, workout, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteWorkout(token: string, id: string) {
  const res = await axios.delete(`${API_BASE}/workouts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getMeals(token: string) {
  const res = await axios.get(`${API_BASE}/meals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addMeal(token: string, meal: any) {
  const res = await axios.post(`${API_BASE}/meals`, meal, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateMeal(token: string, id: string, meal: any) {
  const res = await axios.put(`${API_BASE}/meals/${id}`, meal, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteMeal(token: string, id: string) {
  const res = await axios.delete(`${API_BASE}/meals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
} 