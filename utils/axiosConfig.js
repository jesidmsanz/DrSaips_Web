import axios from "axios";

export const apiUrl = axios.create({
  baseURL: process.env.URL_BASE, // Reemplaza con la URL base de tu API
});
