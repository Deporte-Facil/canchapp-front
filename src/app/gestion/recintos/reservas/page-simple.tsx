"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import apiClient, { BASE_URL } from '../../../lib/api';
import { TEST_ADMIN_ID } from '../../../utils/constants';

const GestionReservasPageSimple = () => {
  const [status, setStatus] = useState('Iniciando...');
  const [error, setError] = useState<string | null>(null);
  const [reservas, setReservas] = useState<any[]>([]);

  const testConexion = async () => {
    setStatus('🔄 Probando conexión...');
    setError(null);
    
    try {
      console.log('🧪 Test de conexión iniciado');
      console.log('📍 BASE_URL:', BASE_URL);
      console.log('👤 TEST_ADMIN_ID:', TEST_ADMIN_ID);
      
      const response = await apiClient.get(`/playes/gestion/arrendatario/${TEST_ADMIN_ID}`);
      
      console.log('✅ Respuesta recibida:', response);
      setStatus(`✅ Éxito: ${response.data.length} reservas cargadas`);
      setReservas(response.data);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      setStatus('❌ Error en la conexión');
      setError(err.message || 'Error desconocido');
    }
  };

  useEffect(() => {
    console.log('🎯 Componente montado');
    testConexion();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test de Reservas - Versión Simple
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Status: {status}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={testConexion}
        sx={{ mb: 2 }}
      >
        🔄 Reintentar Conexión
      </Button>
      
      {reservas.length > 0 && (
        <Box>
          <Typography variant="h6">
            📋 Reservas encontradas: {reservas.length}
          </Typography>
          {reservas.slice(0, 3).map((reserva, index) => (
            <Box key={index} sx={{ p: 1, border: '1px solid #ccc', mb: 1 }}>
              <Typography variant="body2">
                ID: {reserva._id}<br />
                Estado: {reserva.estado}<br />
                Usuario: {reserva.user?.name || 'N/A'}<br />
                Recinto: {reserva.enclosure?.nombre || 'N/A'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GestionReservasPageSimple;
