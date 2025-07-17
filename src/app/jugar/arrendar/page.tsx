"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  SelectChangeEvent,
  Box,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import ModalArriendo from "../../lib/ModalArriendo";
import { TEST_USER_ID } from "../../utils/constants";
import apiClient from "../../lib/api"; // Importa el apiClient centralizado

// --- INTERFACES ---
interface Cancha {
  tipoCancha: string;
  cantidad: number;
  horariosDisponibles: string;
  materialesCancha: string;
}

interface Recinto {
  _id: string; 
  nombre: string;
  tipoDeporte: string;
  jugadoresMax: string;
  costo: string;
  descripcion: string;
  materiales: string;
  ubicacion: string;
  estacionamiento: boolean;
  petos: boolean;
  arbitros: boolean;
  servicios: string[];
  fechaDisponible: Date; 
  imagen_url: string; 
  canchas: Cancha[]; 
  modalidad?: "equipo" | "solitario" | "ambos";
}

interface ArrendamientoDetails {
  recinto: string;
  fecha: Date; 
  hora: string;
  cancha: string;
  colorCamiseta?: string;
}

// --- COMPONENTE DE PAGO (Simulado) --- (No se usará en el flujo directo ahora)
interface PaymentComponentProps {
  details: { recinto: string; fecha: string; hora: string; }; 
  onPaymentSuccess: () => void;
  onCancel: () => void;
}
function PaymentComponent({ details, onPaymentSuccess, onCancel }: PaymentComponentProps) {
  return (
    <Box sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>Confirmar y Pagar Reserva</Typography>
      <Paper sx={{ p: 2, minWidth: '300px' }}>
        <Typography variant="h6">Detalles de tu reserva:</Typography>
        <Typography><strong>Recinto:</strong> {details.recinto}</Typography>
        <Typography><strong>Fecha:</strong> {details.fecha}</Typography>
        <Typography><strong>Hora:</strong> {details.hora}</Typography>
      </Paper>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={onPaymentSuccess}>
          Pagar con Tarjeta (Simulado)
        </Button>
        <Button variant="outlined" color="error" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ArrendarRecinto() {
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tipoDeporte, setTipoDeporte] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [modalidad, setModalidad] = useState<"solitario" | "equipo" | "">("");

  const [modalOpen, setModalOpen] = useState(false);
  const [recintoSeleccionado, setRecintoSeleccionado] = useState<Recinto | null>(null);

  const [viewState, setViewState] = useState<"lista" | "pagando" | "confirmado">("lista");
  const [arrendamientoDetails, setArrendamientoDetails] = useState<any | null>(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(TEST_USER_ID);

  // --- OBTENER DATOS DEL BACKEND ---
  useEffect(() => {
    const fetchRecintos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Recinto[]>('/enclosure'); // Usa apiClient del archivo central
        setRecintos(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los recintos.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecintos();

  }, []); 

  const deportesDisponibles = useMemo(() => [...new Set(recintos.map((r) => r.tipoDeporte))], [recintos]);
  const ubicacionesDisponibles = useMemo(() => {
    if (!tipoDeporte) return [];
    return [...new Set(recintos.filter((r) => r.tipoDeporte === tipoDeporte).map((r) => r.ubicacion))];
  }, [recintos, tipoDeporte, ubicacion, modalidad]);

  const recintosFiltrados = useMemo(() => {
    return recintos.filter((recinto) => {
      const matchDeporte = tipoDeporte ? recinto.tipoDeporte === tipoDeporte : true;
      const matchUbicacion = ubicacion ? recinto.ubicacion === ubicacion : true;
      const matchModalidad = modalidad ? recinto.modalidad === modalidad || recinto.modalidad === "ambos" : true; 
      return matchDeporte && matchUbicacion && matchModalidad;
    });
  }, [recintos, tipoDeporte, ubicacion, modalidad]);

  const handleDeporteChange = (event: SelectChangeEvent) => {
    setTipoDeporte(event.target.value as string);
    setUbicacion("");
  };

  const handleUbicacionChange = (event: SelectChangeEvent) => setUbicacion(event.target.value as string);
  const handleModalidadChange = (event: SelectChangeEvent) => setModalidad(event.target.value as "solitario" | "equipo" | "");

  const handleOpenModal = (recinto: Recinto) => {
    setRecintoSeleccionado(recinto);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setRecintoSeleccionado(null);
  };

  const handleConfirmArrendamiento = async (details: ArrendamientoDetails & { recintoId: string; }) => {
    // *** NUEVO LOG: Verificar si la función se inicia ***
    console.log('--- page.tsx: INICIANDO handleConfirmArrendamiento ---'); 
    console.log('Detalles recibidos:', details);
    console.log('currentUserId:', currentUserId);
    // -----------------------------------------------------

    if (!currentUserId) {
      alert("Error: No hay un usuario logueado para hacer la reserva. Por favor, asegúrate de que el ID de usuario de prueba esté configurado o inicia sesión.");
      return; 
    }

    const reservaData = {
      enclosure: details.recintoId,
      user: currentUserId, 
      date: details.fecha.toISOString(), 
      time: details.hora
    };

    console.log('--- Frontend: Intentando enviar POST a /api/playes (usando Axios) ---'); 
    console.log('Datos a enviar:', reservaData); 
    console.log('------------------------------------------------------------------'); 

    try {
      const response = await apiClient.post('/playes', reservaData); 

      console.log('--- Frontend: Petición POST enviada exitosamente (respuesta recibida) ---'); 
      console.log('Respuesta del servidor:', response.data); 
      console.log('---------------------------------------------------------------------'); 

      const nuevaReserva = response.data;
      
      setArrendamientoDetails({ ...details, fecha: details.fecha.toLocaleDateString() });
      setMensajeConfirmacion(`¡Reserva para ${details.recinto} creada con éxito! Estado: ${nuevaReserva.estado}.`); 
      setViewState("confirmado"); 
      handleCloseModal(); 

    } catch (error: any) {
      console.error("--- Frontend: Error en la petición POST con Axios ---"); 
      if (error.response) {
        console.error('Código de estado:', error.response.status);
        console.error('Mensaje del servidor:', error.response.data);
        alert(`Error del servidor: ${error.response.data.message || 'Error desconocido.'}`);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor (backend no está levantado o accesible):', error.request);
        alert('Error de conexión: El servidor no está respondiendo.');
      } else {
        console.error('Error al configurar la petición:', error.message);
        alert(`Error: ${error.message || 'Error desconocido al crear la reserva.'}`);
      }
      console.error("--------------------------------------------------"); 
    }
  };

  const handlePaymentSuccess = () => { 
    setMensajeConfirmacion(`¡Pago exitoso! La reserva para ${arrendamientoDetails.recinto} ha sido procesada. Recibirás una confirmación por correo.`);
    setViewState("confirmado");
  };
  
  const handleCancelPayment = () => setViewState("lista"); 

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {viewState === "lista" && (
        <>
          <Typography variant="h4" component="h1" gutterBottom>Arrendar Recintos Deportivos</Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, marginBottom: 3, }}>
            <FormControl fullWidth>
              <InputLabel>Selecciona un deporte</InputLabel>
              <Select value={tipoDeporte} label="Selecciona un deporte" onChange={handleDeporteChange}>
                <MenuItem value=""><em>Todos los deportes</em></MenuItem>
                {deportesDisponibles.map((dep) => (<MenuItem key={dep} value={dep}>{dep}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!tipoDeporte}>
              <InputLabel>Selecciona una ubicación</InputLabel>
              <Select value={ubicacion} label="Selecciona una ubicación" onChange={handleUbicacionChange}>
                <MenuItem value=""><em>Todas las ubicaciones</em></MenuItem>
                {ubicacionesDisponibles.map((loc) => (<MenuItem key={loc} value={loc}>{loc}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Modalidad</InputLabel>
              <Select value={modalidad} label="Modalidad" onChange={handleModalidadChange}>
                <MenuItem value=""><em>Todas</em></MenuItem>
                <MenuItem value="solitario">Solitario</MenuItem>
                <MenuItem value="equipo">Equipo</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre del Recinto</TableCell>
                  <TableCell>Deporte</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell align="right">Costo por hora</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recintosFiltrados.map((recinto) => (
                  <TableRow key={recinto._id} hover>
                    <TableCell component="th" scope="row">{recinto.nombre}</TableCell>
                    <TableCell>{recinto.tipoDeporte}</TableCell>
                    <TableCell>{recinto.ubicacion}</TableCell>
                    <TableCell align="right">${parseInt(recinto.costo, 10).toLocaleString("es-CL")}</TableCell>
                    <TableCell align="center"><Button variant="contained" color="primary" onClick={() => handleOpenModal(recinto)}>Arrendar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {viewState === "pagando" && arrendamientoDetails && <PaymentComponent details={arrendamientoDetails} onPaymentSuccess={handlePaymentSuccess} onCancel={handleCancelPayment} />}
      
      {viewState === "confirmado" && <Alert severity="success" sx={{ mt: 3 }}>{mensajeConfirmacion}<Button onClick={() => setViewState("lista")} sx={{ ml: 2 }} variant="outlined">Arrendar otro recinto</Button></Alert>}

      {recintoSeleccionado && (
        <ModalArriendo
          open={modalOpen}
          onClose={handleCloseModal}
          recinto={recintoSeleccionado}
          onConfirm={(details) => handleConfirmArrendamiento({ ...details, recintoId: recintoSeleccionado._id })}
          tipo={modalidad}
        />
      )}
    </Box>
  );
}