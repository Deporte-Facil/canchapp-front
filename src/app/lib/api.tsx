// src/app/lib/api.ts

import axios from 'axios';

// URL base de la API
export const BASE_URL = 'http://localhost:4000/api';

// 1. Se crea una instancia de axios con la configuración base.
//    Esto evita que tengas que escribir la URL completa en cada petición.
const apiClient = axios.create({
  baseURL: BASE_URL, // La URL base de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Funciones para interactuar con la API ---

// 2. Función para obtener todos los recinto.
//    Llama al endpoint: GET /api/enclosure
export const getRecintos = () => apiClient.get('/enclosure');

// 3. Función para crear una nueva reserva (playe).
//    Llama al endpoint: POST /api/playes
export const createPlaye = (playeData: any) => apiClient.post('/playes', playeData);

// 4. Función para obtener todas las reservas (para el panel de gestión).
//    Llama al endpoint: GET /api/playes/gestion/reservas
export const getReservas = () => apiClient.get('/playes/gestion/reservas');

// 5. Función para actualizar el estado de una reserva.
//    Llama al endpoint: PATCH /api/playes/gestion/reservas/:id
export const updateEstadoReserva = (id: string, estado: 'confirmado' | 'rechazado') => 
  apiClient.patch(`/playes/gestion/reservas/${id}`, { estado });

// Exportamos la instancia por si necesitas hacer llamadas más complejas en otro lugar.
export default apiClient;