import axios from "axios";

export const apiUrl = axios.create({
  baseURL: "http://localhost:3000", // Reemplaza con la URL base de tu API
});
