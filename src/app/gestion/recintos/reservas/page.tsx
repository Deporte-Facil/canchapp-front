"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Alert, Tabs, Tab
} from '@mui/material';
import axios from 'axios'; 

// Interfaz para la reserva (debe coincidir con lo que envía el backend)
interface Reserva {
  _id: string;
  enclosure: { _id: string; nombre: string; }; 
  user: { _id: string; name: string, lastName: string, email: string; }; 
  date: string;
  time: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  createdAt: string; 
  updatedAt: string; 
  __v: number; 
}

const GestionReservasPage = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [accion, setAccion] = useState<'confirmado' | 'rechazado' | null>(null);
  
  const [tabIndex, setTabIndex] = useState(0);

  // Crear una instancia de Axios para tu API
  const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // La URL base de tu backend
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Función para obtener las reservas del backend
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Reserva[]>('/playes/gestion/reservas'); 
      setReservas(response.data); 
    } catch (err: any) {
      console.error("Error al cargar reservas:", err);
      setError(err.message || 'Error al cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas(); 
  }, []);

  const handleOpenDialog = (reserva: Reserva, accionReserva: 'confirmado' | 'rechazado') => {
    setReservaSeleccionada(reserva);
    setAccion(accionReserva);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservaSeleccionada(null);
    setAccion(null);
  };

  const handleConfirmarAccion = async () => {
    if (!reservaSeleccionada || !accion) return;

    setLoading(true); 
    try {
      const response = await apiClient.patch<Reserva>(`/playes/gestion/reservas/${reservaSeleccionada._id}`, { estado: accion });

      setReservas(prev => prev.map(r => 
          r._id === reservaSeleccionada._id ? { ...r, estado: response.data.estado } : r 
      ));
      
      handleCloseDialog();

    } catch (err: any) {
      console.error("Error al actualizar estado de reserva:", err);
      setError(err.response?.data?.message || err.message || 'Error al actualizar la reserva.'); 
      handleCloseDialog(); 
    } finally {
      setLoading(false); 
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const getChipColor = (estado: string) => {
    if (estado === 'confirmado') return 'success';
    if (estado === 'pendiente') return 'warning';
    return 'error';
  };
  
  const filteredReservas = reservas.filter(reserva => {
    if (tabIndex === 0) return reserva.estado === 'pendiente';
    if (tabIndex === 1) return reserva.estado === 'confirmado';
    if (tabIndex === 2) return reserva.estado === 'rechazado';
    return true; 
  });

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>Gestionar Reservas</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="pestañas de reservas">
          <Tab label="Pendientes" />
          <Tab label="Confirmadas" />
          <Tab label="Rechazadas" />
          <Tab label="Todas" /> 
        </Tabs>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {!loading && !error && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="tabla de reservas">
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Recinto</TableCell>
                  <TableCell>Fecha y Hora</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay reservas en esta categoría.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservas.map((reserva) => (
                    <TableRow hover key={reserva._id}>
                      <TableCell>{`${reserva.user.name} ${reserva.user.lastName}`}</TableCell>
                      <TableCell>{reserva.enclosure.nombre}</TableCell>
                      <TableCell>{`${new Date(reserva.date).toLocaleDateString('es-CL')} - ${reserva.time}`}</TableCell> 
                      <TableCell><Chip label={reserva.estado} color={getChipColor(reserva.estado)} size="small" /></TableCell>
                      <TableCell align="center">
                        {reserva.estado === 'pendiente' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button size="small" variant="contained" color="success" onClick={() => handleOpenDialog(reserva, 'confirmado')}>Aceptar</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleOpenDialog(reserva, 'rechazado')}>Rechazar</Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Modal de confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Acción</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas <strong>{accion === 'confirmado' ? 'aceptar' : 'rechazar'}</strong> la reserva de <strong>{reservaSeleccionada?.user.name}</strong> para el recinto <strong>{reservaSeleccionada?.enclosure.nombre}</strong> el <strong>{reservaSeleccionada?.date ? new Date(reservaSeleccionada.date).toLocaleDateString('es-CL') : ''}</strong> a las <strong>{reservaSeleccionada?.time}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmarAccion} autoFocus color={accion === 'confirmado' ? 'success' : 'error'}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionReservasPage;