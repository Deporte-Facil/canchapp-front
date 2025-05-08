'use client'


import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Agenda from '../../lib/agenda';  // Asegúrate de que la ruta sea correcta

function Jugadores() {
  const [deporte, setDeporte] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [arrendamientoDetails, setArrendamientoDetails] = useState<string | null>(null);

  const recintos = {
    futbol: [
      { nombre: 'Estadio Municipal', valor: '$100', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha 1', valor: '$50', ubicacion: 'Valparaíso, Chile' },
      { nombre: 'Estadio Nacional', valor: '$300', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha de Fútbol Playa', valor: '$60', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Cancha San Carlos de Apoquindo', valor: '$150', ubicacion: 'Las Condes, Santiago, Chile' },
    ],
    tenis: [
      { nombre: 'Club Tenis Santiago', valor: '$80', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Centro Tenis', valor: '$60', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Club de Tenis Las Condes', valor: '$120', ubicacion: 'Santiago, Chile' },
      { nombre: 'Tenis Club Valparaíso', valor: '$75', ubicacion: 'Valparaíso, Chile' },
      { nombre: 'Complejo Deportivo El Peñalolén', valor: '$90', ubicacion: 'Peñalolén, Santiago, Chile' },
    ],
    basquetbol: [
      { nombre: 'Polideportivo San Felipe', valor: '$90', ubicacion: 'San Felipe, Chile' },
      { nombre: 'Cancha Basket Arena', valor: '$70', ubicacion: 'Rancagua, Chile' },
      { nombre: 'Estadio de Basketball Santiago', valor: '$150', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Deportiva Ñuñoa', valor: '$60', ubicacion: 'Ñuñoa, Santiago, Chile' },
    ],
    voleibol: [
      { nombre: 'Complejo Deportivo Los Andes', valor: '$60', ubicacion: 'Los Andes, Chile' },
      { nombre: 'Volei Club', valor: '$50', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Club Deportivo de Voleibol Santiago', valor: '$95', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Polideportiva Concepción', valor: '$70', ubicacion: 'Concepción, Chile' },
    ],
    paddle: [
      { nombre: 'Paddle Club Santiago', valor: '$110', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Paddle Valparaíso', valor: '$95', ubicacion: 'Valparaíso, Chile' },
      { nombre: 'Club Paddle Chile', valor: '$120', ubicacion: 'Santiago, Chile' },
      { nombre: 'Paddle Park Viña', valor: '$80', ubicacion: 'Viña del Mar, Chile' },
    ],
    golf: [
      { nombre: 'Golf Club Chile', valor: '$150', ubicacion: 'Santiago, Chile' },
      { nombre: 'Club de Golf Los Leones', valor: '$120', ubicacion: 'La Dehesa, Chile' },
      { nombre: 'Club de Golf Puente Alto', valor: '$100', ubicacion: 'Puente Alto, Chile' },
      { nombre: 'Golf Club Rancagua', valor: '$130', ubicacion: 'Rancagua, Chile' },
    ],
    natacion: [
      { nombre: 'Piscina Olímpica Santiago', valor: '$30', ubicacion: 'Santiago, Chile' },
      { nombre: 'Centro Acuático Viña', valor: '$25', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Piscina del Parque O’Higgins', valor: '$20', ubicacion: 'Santiago, Chile' },
      { nombre: 'Piscina Los Boldos', valor: '$40', ubicacion: 'Viña del Mar, Chile' },
    ],
    rugby: [
      { nombre: 'Estadio de Rugby Los Dominicos', valor: '$100', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Rugby Viña', valor: '$80', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Estadio Nacional Rugby', valor: '$200', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha de Rugby de Concepción', valor: '$90', ubicacion: 'Concepción, Chile' },
    ],
    badminton: [
      { nombre: 'Badminton Club Chile', valor: '$40', ubicacion: 'Santiago, Chile' },
      { nombre: 'Polideportivo Rancagua', valor: '$35', ubicacion: 'Rancagua, Chile' },
      { nombre: 'Centro Deportivo Ñuñoa', valor: '$50', ubicacion: 'Ñuñoa, Santiago, Chile' },
      { nombre: 'Badminton Club Viña', valor: '$45', ubicacion: 'Viña del Mar, Chile' },
    ],
    ciclismo: [
      { nombre: 'Ciclódromo de Santiago', valor: '$60', ubicacion: 'Santiago, Chile' },
      { nombre: 'Ciclismo Parque Arauco', valor: '$50', ubicacion: 'Santiago, Chile' },
      { nombre: 'Cancha Ciclismo Concepción', valor: '$40', ubicacion: 'Concepción, Chile' },
    ],
    escalada: [
      { nombre: 'Escalada Club Santiago', valor: '$70', ubicacion: 'Santiago, Chile' },
      { nombre: 'Roca y Montaña Viña', valor: '$60', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Club Escalada Los Andes', valor: '$80', ubicacion: 'Los Andes, Chile' },
    ],
    hockey: [
      { nombre: 'Estadio de Hockey Ñuñoa', valor: '$100', ubicacion: 'Ñuñoa, Santiago, Chile' },
      { nombre: 'Cancha Hockey Santiago', valor: '$80', ubicacion: 'Santiago, Chile' },
      { nombre: 'Estadio de Hockey Viña', valor: '$90', ubicacion: 'Viña del Mar, Chile' },
    ],
    artesMarciales: [
      { nombre: 'Academia de Artes Marciales Santiago', valor: '$50', ubicacion: 'Santiago, Chile' },
      { nombre: 'Dojo Viña del Mar', valor: '$40', ubicacion: 'Viña del Mar, Chile' },
      { nombre: 'Club de Judo Valparaíso', valor: '$30', ubicacion: 'Valparaíso, Chile' },
      { nombre: 'Polideportivo Concepción', valor: '$60', ubicacion: 'Concepción, Chile' },
    ],
  };
  
  

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDeporte(event.target.value as string);
  };

  const handleArrendarSolo = () => {
    setModalOpen(true);
  };

  const handleArrendarEquipo = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmArrendamiento = (date: Date, time: Date, equipo: string | null, buscandoRival: string) => {
    setArrendamientoDetails(`Arrendamiento confirmado para ${date.toLocaleDateString()} a las ${time.toLocaleTimeString()} para el equipo: ${equipo}. Buscando rival: ${buscandoRival}`);
    setModalOpen(false);  // Cierra el modal
  };

  return (
    <div>
      <h1>Arrendar Recintos Deportivos</h1>

      {/* Selector de deportes */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="deporte-selector-label">Selecciona un deporte</InputLabel>
        <Select
          labelId="deporte-selector-label"
          id="deporte-selector"
          value={deporte}
          label="Selecciona un deporte"
          onChange={handleChange}
        >
          <MenuItem value="futbol">Fútbol</MenuItem>
          <MenuItem value="tenis">Tenis</MenuItem>
          <MenuItem value="basquetbol">Básquetbol</MenuItem>
          <MenuItem value="voleibol">Voleibol</MenuItem>
          <MenuItem value="paddle">Paddle</MenuItem>
          <MenuItem value="golf">Golf</MenuItem>
          <MenuItem value="natacion">Natación</MenuItem>
          <MenuItem value="rugby">Rugby</MenuItem>
          <MenuItem value="escalada">Escalada</MenuItem>

          {/* Añadir más opciones de deporte */}
        </Select>
      </FormControl>

      {/* Mostrar información del deporte seleccionado */}
      {deporte && <p>Has seleccionado: {deporte}</p>}

      {/* Tabla con recintos deportivos */}
      {deporte && recintos[deporte] && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de recintos deportivos">
            <TableHead>
              <TableRow>
                <TableCell>Nombre del recinto</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recintos[deporte].map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.valor}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={handleArrendarSolo}
                    >
                      Arrendar 
                    </Button>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal con el calendario */}
      {modalOpen && (
        <Agenda
          onClose={handleCloseModal}
          onConfirm={handleConfirmArrendamiento}
          isTeamBooking={true}  // Habilita el selector de equipo
        />
      )}

      {/* Mostrar detalles del arrendamiento confirmado */}
      {arrendamientoDetails && (
        <div style={{ marginTop: '20px' }}>
          <h3>{arrendamientoDetails}</h3>
        </div>
      )}
    </div>
  );
}

export default Jugadores;
