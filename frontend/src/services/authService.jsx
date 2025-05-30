// src/services/authService.js
import { fetchAPI } from '../Utils'

export async function loginUser(loginInfo) {
  const options = {
      method: "POST",
      body: JSON.stringify({
          username: loginInfo.username,
          password: loginInfo.password,
          keepLoggedIn: true// document.getElementById("keepLoggedIn").checked === true
      })
  }
  const res = await fetchAPI('/login', options)

  if (!res.ok) {
    throw new Error('Login failed');
  }

  const data = await res.json();
  return data.user;
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