// src/services/authService.js
import { fetchAPI } from '../Utils'

export async function loginUser(credentials) {
  const res = await fetchAPI('/login', credentials)

  if (!res.ok) {
    throw new Error('Login failed');
  }

  const data = await res.json();
  localStorage.setItem('token', data.token); // Store JWT
  return data.username;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token');

  const res = await fetchAPI('/token', {
      headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Invalid token');
  return res.json();
}