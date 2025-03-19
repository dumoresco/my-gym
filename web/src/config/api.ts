"use client";

import axios from "axios";

// Criando a instância do axios
const api = axios.create({
  baseURL: "https://my-gym-jyqhaxpokq-uc.a.run.app/api", // Base URL para as requisições
});

export default api;
