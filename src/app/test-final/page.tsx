"use client";

import React, { useState, useEffect } from 'react';

const TestFinalPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConexion = async () => {
    addLog('🔄 Iniciando test de conexión...');
    
    try {
      addLog('📍 URL: http://localhost:4000/api/playes/gestion/arrendatario/68792de41c3b7ae75d9f8838');
      
      const response = await fetch('http://localhost:4000/api/playes/gestion/arrendatario/68792de41c3b7ae75d9f8838', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      addLog(`📊 Status: ${response.status}`);
      addLog(`📊 Status Text: ${response.statusText}`);
      
      if (response.ok) {
        const result = await response.json();
        addLog(`✅ Datos recibidos: ${result.length} reservas`);
        setData(result);
      } else {
        addLog(`❌ Error HTTP: ${response.status}`);
      }
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      addLog(`🔍 Error type: ${error.constructor.name}`);
    }
  };

  useEffect(() => {
    addLog('🎯 Componente montado - iniciando test automático');
    testConexion();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧪 Test Final - Diagnóstico Completo</h1>
      
      <button 
        onClick={testConexion}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Reintentar Test
      </button>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h3>📋 Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {log}
          </div>
        ))}
      </div>
      
      {data && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '15px', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <h3>✅ Datos recibidos:</h3>
          <p><strong>Total reservas:</strong> {data.length}</p>
          {data.length > 0 && (
            <div>
              <p><strong>Primera reserva:</strong></p>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(data[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestFinalPage;
