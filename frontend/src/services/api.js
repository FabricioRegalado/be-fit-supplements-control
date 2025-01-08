import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Cambia si tu backend está en otro puerto/servidor
});

export default API;
