"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';

const TestReservasPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando fetch simple...');
      
      const response = await fetch('http://localhost:4000/api/playes/gestion/arrendatario/68792de41c3b7ae75d9f8838');
      
      console.log('📊 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Datos recibidos:', result);
        setData(result);
      } else {
        console.error('❌ Error HTTP:', response.status);
        setError(`Error HTTP: ${response.status}`);
      }
      
    } catch (err: any) {
      console.error('❌ Error en fetch:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🎯 Componente montado, iniciando fetch automático');
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test Simple de Reservas
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={fetchData}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : '🔄 Recargar'}
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {data && (
        <Box>
          <Typography variant="h6">
            ✅ Datos cargados: {data.length} reservas
          </Typography>
          <pre style={{ 
            fontSize: '12px',
            background: '#f5f5f5',
            padding: '10px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default TestReservasPage;
