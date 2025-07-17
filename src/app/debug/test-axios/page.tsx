"use client";

import { useState } from 'react';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import apiClient, { BASE_URL } from '../../lib/api';
import { TEST_ADMIN_ID } from '../../utils/constants';

const TestAxiosPage = () => {
  const [resultado, setResultado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApiClient = async () => {
    setLoading(true);
    setResultado('🔄 Iniciando prueba con nuestro apiClient...\n');
    
    try {
      setResultado(prev => prev + `📍 BASE_URL: ${BASE_URL}\n`);
      setResultado(prev => prev + `👤 TEST_ADMIN_ID: ${TEST_ADMIN_ID}\n`);
      setResultado(prev => prev + `🌐 URL completa: ${BASE_URL}/playes/gestion/arrendatario/${TEST_ADMIN_ID}\n`);
      
      const response = await apiClient.get(`/playes/gestion/arrendatario/${TEST_ADMIN_ID}`);
      
      setResultado(prev => prev + `✅ Status: ${response.status}\n`);
      setResultado(prev => prev + `✅ Data length: ${response.data?.length || 0}\n`);
      setResultado(prev => prev + `📋 Headers: ${JSON.stringify(response.headers, null, 2)}\n`);
      
      if (response.data && response.data.length > 0) {
        setResultado(prev => prev + `📋 Primera reserva: ${JSON.stringify(response.data[0], null, 2)}\n`);
      }
      
    } catch (error: any) {
      setResultado(prev => prev + `❌ Error: ${error.message}\n`);
      
      if (error.response) {
        setResultado(prev => prev + `📊 Response Status: ${error.response.status}\n`);
        setResultado(prev => prev + `📊 Response Data: ${JSON.stringify(error.response.data, null, 2)}\n`);
        setResultado(prev => prev + `📊 Response Headers: ${JSON.stringify(error.response.headers, null, 2)}\n`);
      }
      
      if (error.request) {
        setResultado(prev => prev + `📡 Request: ${error.request}\n`);
      }
      
      if (error.code) {
        setResultado(prev => prev + `🔍 Error Code: ${error.code}\n`);
      }
      
      setResultado(prev => prev + `🔍 Error Name: ${error.name}\n`);
      setResultado(prev => prev + `🔍 Error Stack: ${error.stack}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setResultado('🔄 Iniciando prueba con fetch directo...\n');
    
    try {
      const url = `${BASE_URL}/playes/gestion/arrendatario/${TEST_ADMIN_ID}`;
      setResultado(prev => prev + `🌐 URL: ${url}\n`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setResultado(prev => prev + `📊 Status: ${response.status}\n`);
      setResultado(prev => prev + `📊 Status Text: ${response.statusText}\n`);
      setResultado(prev => prev + `📊 Headers: ${JSON.stringify([...response.headers.entries()], null, 2)}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setResultado(prev => prev + `✅ Data length: ${data.length}\n`);
        if (data.length > 0) {
          setResultado(prev => prev + `📋 Primera reserva: ${JSON.stringify(data[0], null, 2)}\n`);
        }
      } else {
        const errorText = await response.text();
        setResultado(prev => prev + `❌ Error response: ${errorText}\n`);
      }
      
    } catch (error: any) {
      setResultado(prev => prev + `❌ Fetch Error: ${error.message}\n`);
      setResultado(prev => prev + `🔍 Error Type: ${error.constructor.name}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test Axios vs Fetch - Reservas
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={testApiClient}
          disabled={loading}
          color="primary"
        >
          📡 Test ApiClient (Axios)
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testDirectFetch}
          disabled={loading}
          color="secondary"
        >
          🌐 Test Fetch Directo
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
            fontSize: '11px',
            maxHeight: '500px',
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            padding: '15px',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            {resultado}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default TestAxiosPage;
