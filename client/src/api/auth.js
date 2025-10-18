// src/api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// 🔹 LOGIN
export const loginUser = async (correo, password) => {
  return axios.post(`${API_URL}/login`, { correo, password });
};

// 🔹 REGISTER
export const registerUser = async (nombre_completo, correo, password) => {
  return axios.post(`${API_URL}/register`, { nombre_completo, correo, password });
};
