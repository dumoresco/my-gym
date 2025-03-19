"use client";

import axios from "axios";

// Criando a instância do axios
const api = axios.create({
  baseURL: "https://my-gym-509205781049.us-central1.run.app/api", // Base URL para as requisições
});

export default api;
