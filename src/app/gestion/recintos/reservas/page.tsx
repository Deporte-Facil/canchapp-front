"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Alert, Tabs, Tab, IconButton, Tooltip
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import apiClient, { BASE_URL } from '../../../lib/api'; // Importamos la instancia de axios configurada
import { TEST_ADMIN_ID } from '../../../utils/constants';
// Importa apiClient si lo usas centralizado, o usa axios directamente
// import apiClient from '../../../lib/api'; // Si tienes un apiClient centralizado

// Interfaz para la reserva (debe coincidir con lo que envía el backend)
interface Reserva {
  _id: string;
  enclosure: { _id: string; nombre: string; admin: { _id: string; name: string; lastName: string; email: string; } }; // Incluir admin del recinto
  user: { _id: string; name: string, lastName: string, email: string; } | null; // User puede ser null
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [accion, setAccion] = useState<'confirmado' | 'rechazado' | null>(null);

  const [tabIndex, setTabIndex] = useState(0);

  // Función para obtener las reservas del backend
  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Iniciando fetch de reservas...');
      console.log('📍 URL del backend:', BASE_URL);
      console.log('👤 Admin ID:', TEST_ADMIN_ID);
      
      // PRUEBA DIRECTA CON FETCH PRIMERO
      console.log('🧪 Probando con fetch directo...');
      const testUrl = `${BASE_URL}/playes/gestion/arrendatario/${TEST_ADMIN_ID}`;
      const testResponse = await fetch(testUrl);
      console.log('🧪 Fetch Status:', testResponse.status);
      
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('🧪 Fetch Data:', testData.length, 'reservas');
        setReservas(testData);
        setLastUpdated(new Date());
        return; // Si fetch funciona, usar esos datos
      }
      
      // SI FETCH FALLA, PROBAR CON AXIOS
      console.log('🧪 Probando con axios...');
      const response = await apiClient.get<Reserva[]>(`/playes/gestion/arrendatario/${TEST_ADMIN_ID}`);
      
      console.log('✅ Respuesta exitosa del backend:', response.data);
      console.log('📊 Total de reservas recibidas:', response.data?.length || 0);
      
      setReservas(response.data);
      setLastUpdated(new Date());
      console.log(`✅ Reservas cargadas: ${response.data.length} encontradas`);
    } catch (err: any) {
      console.error("❌ Error al cargar reservas:", err);
      console.error('📋 Detalles del error:', {
        message: err.message,
        code: err.code,
        response: err.response,
        config: err.config
      });
      setError(err.message || 'Error al cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar reservas al montar el componente
    fetchReservas();

    // Auto-refrescar cada 30 segundos
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh de reservas...');
      fetchReservas();
    }, 30000);

    return () => clearInterval(interval);
  }, [TEST_ADMIN_ID]); // Dependencia para recargar si el ID de prueba cambia

  const handleOpenDialog = (reserva: Reserva, accionReserva: 'confirmado' | 'rechazado') => {
    console.log('🚀 handleOpenDialog ejecutado');
    console.log('📋 Reserva:', reserva);
    console.log('⚡ Acción:', accionReserva);
    
    setReservaSeleccionada(reserva);
    setAccion(accionReserva);
    setOpenDialog(true);
    
    console.log('✅ Dialog abierto');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservaSeleccionada(null);
    setAccion(null);
  };

  const testConexion = async () => {
    console.log('🧪 === TEST DE CONEXIÓN ===');
    console.log('📍 URL del backend:', BASE_URL);
    console.log('👤 Admin ID:', TEST_ADMIN_ID);
    console.log('🌐 URL completa:', `${BASE_URL}/playes/gestion/arrendatario/${TEST_ADMIN_ID}`);
    
    try {
      const response = await fetch(`${BASE_URL}/playes/gestion/arrendatario/${TEST_ADMIN_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        console.log('✅ Total reservas:', data.length);
        alert(`✅ Conexión exitosa! Recibidas ${data.length} reservas`);
      } else {
        console.error('❌ Error HTTP:', response.status, response.statusText);
        alert(`❌ Error HTTP: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('❌ Error de conexión:', error);
      alert(`❌ Error de conexión: ${error.message}`);
    }
  };

  const resetAll = () => {
    setReservas([]);
    setError(null);
    setLoading(false);
    console.log('🔄 Estado reseteado');
  };

  const handleConfirmarAccion = async () => {
    console.log('🔄 handleConfirmarAccion iniciado');
    console.log('📋 reservaSeleccionada:', reservaSeleccionada);
    console.log('⚡ accion:', accion);
    
    if (!reservaSeleccionada || !accion) {
      console.log('❌ No hay reserva seleccionada o acción');
      return;
    }

    setLoading(true);
    try {
      const url = `/playes/gestion/reservas/${reservaSeleccionada._id}`;
      const data = { estado: accion };
      
      console.log('🌐 Enviando PATCH a:', url);
      console.log('📦 Datos a enviar:', data);
      
      const response = await apiClient.patch<Reserva>(url, data);
      
      console.log('✅ Respuesta recibida:', response.data);

      // Actualiza el estado de la reserva en la lista local
      setReservas(prev => prev.map(r =>
          r._id === reservaSeleccionada._id ? { ...r, estado: response.data.estado } : r
      ));

      handleCloseDialog();
      console.log('🎉 Reserva actualizada con éxito');

    } catch (err: any) {
      console.error("❌ Error al actualizar estado de reserva:", err);
      console.error("📋 Detalles del error:", err.response?.data);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Gestionar Reservas (Arrendatario)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={testConexion}
            size="small"
          >
            🧪 Test Conexión
          </Button>
          <Button 
            variant="outlined" 
            color="warning" 
            onClick={resetAll}
            size="small"
          >
            🔄 Reset
          </Button>
          <Tooltip title="Refrescar reservas">
            <IconButton 
              onClick={() => {
                console.log('🔄 Refrescando reservas manualmente...');
                fetchReservas();
              }}
              disabled={loading}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="pestañas de reservas">
            <Tab label={`Pendientes (${reservas.filter(r => r.estado === 'pendiente').length})`} />
            <Tab label={`Confirmadas (${reservas.filter(r => r.estado === 'confirmado').length})`} />
            <Tab label={`Rechazadas (${reservas.filter(r => r.estado === 'rechazado').length})`} />
            <Tab label={`Todas (${reservas.length})`} />
          </Tabs>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {lastUpdated.toLocaleTimeString('es-CL')}
            </Typography>
          )}
        </Box>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="tabla de reservas">
              <TableHead>
                <TableRow>
                  <TableCell>Usuario que Reserva</TableCell>
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
                      <TableCell>
                        {reserva.user 
                          ? `${reserva.user.name} ${reserva.user.lastName}` 
                          : 'Usuario no disponible'
                        }
                      </TableCell>
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
            ¿Estás seguro de que deseas <strong>{accion === 'confirmado' ? 'aceptar' : 'rechazar'}</strong> la reserva de{' '}
            <strong>
              {reservaSeleccionada?.user 
                ? reservaSeleccionada.user.name 
                : 'Usuario no disponible'
              }
            </strong> para el recinto <strong>{reservaSeleccionada?.enclosure.nombre}</strong> el <strong>{reservaSeleccionada?.date ? new Date(reservaSeleccionada.date).toLocaleDateString('es-CL') : ''}</strong> a las <strong>{reservaSeleccionada?.time}</strong>?
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