"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Alert, Tabs, Tab
} from '@mui/material';

interface Reserva {
  _id: string;
  enclosure: { nombre: string };
  user: { name: string, lastName: string, email: string };
  date: string;
  time: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
}

const GestionReservasPage = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [accion, setAccion] = useState<'confirmado' | 'rechazado' | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const mockData: Reserva[] = [
      { _id: '1', enclosure: { nombre: 'Complejo El Océano' }, user: { name: 'Juan', lastName: 'Perez', email: 'juan@test.com' }, date: '2025-08-10T19:00:00Z', time: '19:00', estado: 'pendiente' },
      { _id: '2', enclosure: { nombre: 'Gimnasio Quilpué' }, user: { name: 'Ana', lastName: 'Gómez', email: 'ana@test.com' }, date: '2025-08-11T18:00:00Z', time: '18:00', estado: 'confirmado' },
      { _id: '3', enclosure: { nombre: 'Complejo El Océano' }, user: { name: 'Pedro', lastName: 'Pascal', email: 'pedro@test.com' }, date: '2025-08-12T20:00:00Z', time: '20:00', estado: 'rechazado' },
      { _id: '4', enclosure: { nombre: 'Dunas de Concón' }, user: { name: 'Maria', lastName: 'Soto', email: 'maria@test.com' }, date: '2025-08-13T17:00:00Z', time: '17:00', estado: 'pendiente' },
    ];
    setReservas(mockData);
    setLoading(false);
  }, []);

  const handleOpenDialog = (reserva: Reserva, accionReserva: 'confirmado' | 'rechazado') => {
    setReservaSeleccionada(reserva);
    setAccion(accionReserva);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmarAccion = () => {
    if (!reservaSeleccionada || !accion) return;
    setReservas(prev => prev.map(r => r._id === reservaSeleccionada._id ? { ...r, estado: accion } : r));
    handleCloseDialog();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue);

  const getChipColor = (estado: string) => {
    if (estado === 'confirmado') return 'success';
    if (estado === 'pendiente') return 'warning';
    return 'error';
  };
  
  const filteredReservas = reservas.filter(reserva => {
    const tabs = ['pendiente', 'confirmado', 'rechazado'];
    return tabIndex > 2 ? true : reserva.estado === tabs[tabIndex];
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

      {loading ? <CircularProgress /> :
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow><TableCell>Usuario</TableCell><TableCell>Recinto</TableCell><TableCell>Fecha y Hora</TableCell><TableCell>Estado</TableCell><TableCell align="center">Acciones</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {filteredReservas.map((reserva) => (
                  <TableRow hover key={reserva._id}>
                    <TableCell>{`${reserva.user.name} ${reserva.user.lastName}`}</TableCell>
                    <TableCell>{reserva.enclosure.nombre}</TableCell>
                    <TableCell>{`${new Date(reserva.date).toLocaleDateString()} - ${reserva.time}`}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      }

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Acción</DialogTitle>
        <DialogContent><DialogContentText>¿Estás seguro de que deseas <strong>{accion}</strong> la reserva?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmarAccion} autoFocus color={accion === 'confirmado' ? 'success' : 'error'}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionReservasPage;