"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress, Alert, 
  Table, TableContainer, TableHead, TableRow, TableCell, TableBody,
  Chip
} from '@mui/material';
import apiClient from '../lib/api';

interface Admin {
  _id: string;
  name: string;
  lastName: string;
  email: string;
}

interface Enclosure {
  _id: string;
  nombre: string;
  admin: Admin;
}

const DebugPage = () => {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnclosures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Enclosure[]>('/enclosure');
      setEnclosures(response.data);
    } catch (err: any) {
      console.error("Error al cargar recintos:", err);
      setError('Error al cargar recintos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Extraer administradores únicos de los recintos
  const adminUsers = enclosures
    .filter(enclosure => enclosure.admin) // Solo recintos con admin
    .reduce((acc: Admin[], enclosure) => {
      // Evitar duplicados
      if (!acc.find(admin => admin._id === enclosure.admin._id)) {
        acc.push(enclosure.admin);
      }
      return acc;
    }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`ID copiado al portapapeles: ${text}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔧 Configurar ID de Administrador - Simplificado
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Esta página te ayuda a identificar IDs de administradores reales desde los recintos.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={fetchEnclosures} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Cargar Recintos y Administradores'}
        </Button>
      </Box>

      {/* Administradores encontrados */}
      {adminUsers.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            👤 Administradores Disponibles (Usar para TEST_ADMIN_ID)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Estos son los administradores que tienen recintos asignados. Copia uno de estos IDs para usarlo en las constantes.
          </Alert>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre Completo</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>ID del Administrador</strong></TableCell>
                  <TableCell><strong>Recintos a Cargo</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminUsers.map((admin) => (
                  <TableRow key={admin._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>{`${admin.name} ${admin.lastName}`}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell sx={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.9rem',
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1
                    }}>
                      {admin._id}
                    </TableCell>
                    <TableCell>
                      {enclosures
                        .filter(enc => enc.admin?._id === admin._id)
                        .map(enc => (
                          <Chip 
                            key={enc._id} 
                            label={enc.nombre} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))
                      }
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="contained"
                        color="success"
                        onClick={() => copyToClipboard(admin._id)}
                      >
                        📋 Copiar ID
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Todos los recintos */}
      {enclosures.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            🏟️ Todos los Recintos
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Administrador</TableCell>
                  <TableCell>ID Recinto</TableCell>
                  <TableCell>ID Admin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enclosures.map((enclosure) => (
                  <TableRow key={enclosure._id}>
                    <TableCell>{enclosure.nombre}</TableCell>
                    <TableCell>
                      {enclosure.admin 
                        ? `${enclosure.admin.name} ${enclosure.admin.lastName}` 
                        : <Chip label="Sin asignar" color="error" size="small" />
                      }
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{enclosure._id}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {enclosure.admin?._id || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>📋 Instrucciones Simplificadas</Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li><strong>Haz clic en "Cargar Recintos y Administradores"</strong></li>
            <li><strong>En la tabla de "Administradores Disponibles"</strong>, elige uno que tenga recintos</li>
            <li><strong>Haz clic en "📋 Copiar ID"</strong> del administrador elegido</li>
            <li><strong>Ve a</strong> <code>src/app/utils/constants.tsx</code></li>
            <li><strong>Reemplaza</strong> <code>"ID_DEL_ADMINISTRADOR_DE_PRUEBA"</code> con el ID copiado</li>
            <li><strong>Guarda el archivo</strong> y ve a <code>/gestion/recintos/reservas</code></li>
          </ol>
        </Typography>
      </Box>
    </Box>
  );
};

export default DebugPage;
