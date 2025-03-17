"use client";

import axios from "axios";

// Criando a instância do axios
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Base URL para as requisições
});

export default api;
