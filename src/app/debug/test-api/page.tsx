"use client";

import { useState } from 'react';
import { Button, Box, Typography, Paper, Alert } from '@mui/material';

const TestApiPage = () => {
  const [resultado, setResultado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setResultado('🔄 Iniciando prueba...\n');
    
    try {
      console.log('🧪 Iniciando test de fetch...');
      
      const url = 'http://localhost:4000/api/playes/gestion/arrendatario/68792de41c3b7ae75d9f8838';
      setResultado(prev => prev + `📍 URL: ${url}\n`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setResultado(prev => prev + `📊 Status: ${response.status}\n`);
      setResultado(prev => prev + `📊 Status Text: ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setResultado(prev => prev + `✅ Datos recibidos: ${data.length} reservas\n`);
        setResultado(prev => prev + `📋 Primer resultado: ${JSON.stringify(data[0], null, 2)}\n`);
      } else {
        setResultado(prev => prev + `❌ Error HTTP: ${response.status}\n`);
      }
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      setResultado(prev => prev + `❌ Error: ${error.message}\n`);
      setResultado(prev => prev + `🔍 Tipo de error: ${error.constructor.name}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testAxios = async () => {
    setLoading(true);
    setResultado('🔄 Iniciando prueba con Axios...\n');
    
    try {
      // Importación dinámica de axios
      const axios = (await import('axios')).default;
      
      const url = 'http://localhost:4000/api/playes/gestion/arrendatario/68792de41c3b7ae75d9f8838';
      setResultado(prev => prev + `📍 URL: ${url}\n`);
      
      const response = await axios.get(url);
      
      setResultado(prev => prev + `📊 Status: ${response.status}\n`);
      setResultado(prev => prev + `✅ Datos recibidos: ${response.data.length} reservas\n`);
      
    } catch (error: any) {
      console.error('❌ Error Axios:', error);
      setResultado(prev => prev + `❌ Error Axios: ${error.message}\n`);
      if (error.response) {
        setResultado(prev => prev + `📊 Response Status: ${error.response.status}\n`);
        setResultado(prev => prev + `📊 Response Data: ${JSON.stringify(error.response.data)}\n`);
      }
      if (error.code) {
        setResultado(prev => prev + `🔍 Error Code: ${error.code}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test de API - Diagnóstico
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={testFetch}
          disabled={loading}
          color="primary"
        >
          🌐 Test con Fetch
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testAxios}
          disabled={loading}
          color="secondary"
        >
          📡 Test con Axios
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => setResultado('')}
          disabled={loading}
        >
          🧹 Limpiar
        </Button>
      </Box>

      {resultado && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>Resultado:</Typography>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '12px',
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            {resultado}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default TestApiPage;
