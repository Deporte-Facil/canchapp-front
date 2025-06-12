"use client";

import React, { useState, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import Agenda from "../../lib/agenda";
import recintos from "../../data/recintos.json";

type Deportes = keyof typeof recintos;
interface Recinto {
  nombre: string;
  valor: number | string;
  ubicacion: string;
}

export default function Jugadores() {
  const [deporte, setDeporte] = useState<Deportes | "">("");
  const [ubicacion, setUbicacion] = useState<string>(""); // Nuevo estado para la ubicación
  const [modalOpen, setModalOpen] = useState(false);
  const [arrendamientoDetails, setArrendamientoDetails] = useState<
    string | null
  >(null);

  // Cuando cambia el deporte, reseteamos la ubicación
  const handleDeporteChange = (event: SelectChangeEvent) => {
    const nuevoDeporte = event.target.value as Deportes;
    setDeporte(nuevoDeporte);
    setUbicacion(""); // Resetea la ubicación para forzar una nueva selección
  };

  const handleUbicacionChange = (event: SelectChangeEvent) => {
    setUbicacion(event.target.value as string);
  };

  // Obtenemos las ubicaciones únicas para el deporte seleccionado
  const ubicacionesDisponibles = useMemo(() => {
    if (!deporte) return [];
    // new Set() se usa para obtener valores únicos automáticamente
    return [...new Set(recintos[deporte].map((r) => r.ubicacion))];
  }, [deporte]);

  // Filtramos los recintos a mostrar
  const recintosFiltrados = useMemo(() => {
    if (!deporte) return [];
    let filtrados = recintos[deporte];
    if (ubicacion) {
      filtrados = filtrados.filter((r) => r.ubicacion === ubicacion);
    }
    return filtrados;
  }, [deporte, ubicacion]);

  const handleArrendarSolo = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmArrendamiento = (
    date: Date,
    time: Date,
    equipo: string | null,
    buscandoRival: string
  ) => {
    setArrendamientoDetails(
      `Arrendamiento confirmado para ${date.toLocaleDateString()} a las ${time.toLocaleTimeString()} para el equipo: ${equipo}. Buscando rival: ${buscandoRival}`
    );
    setModalOpen(false);
  };

  return (
    <div>
      <h1>Arrendar Recintos Deportivos</h1>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        {/* Filtro de Deporte */}
        <FormControl fullWidth>
          <InputLabel id="deporte-selector-label">
            Selecciona un deporte
          </InputLabel>
          <Select
            labelId="deporte-selector-label"
            id="deporte-selector"
            value={deporte}
            label="Selecciona un deporte"
            onChange={handleDeporteChange}
          >
            {Object.keys(recintos).map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nuevo Filtro de Ubicación */}
        {deporte && (
          <FormControl fullWidth>
            <InputLabel id="ubicacion-selector-label">
              Selecciona una ubicación
            </InputLabel>
            <Select
              labelId="ubicacion-selector-label"
              id="ubicacion-selector"
              value={ubicacion}
              label="Selecciona una ubicación"
              onChange={handleUbicacionChange}
              disabled={!deporte} // Se deshabilita si no hay deporte seleccionado
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {ubicacionesDisponibles.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {deporte && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="tabla de recintos deportivos"
          >
            <TableHead>
              <TableRow>
                <TableCell>Nombre del recinto</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Usamos la lista ya filtrada */}
              {recintosFiltrados.map((row: Recinto, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.valor}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
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

      {modalOpen && (
        <Agenda
          onClose={handleCloseModal}
          onConfirm={handleConfirmArrendamiento}
          isTeamBooking={true}
        />
      )}

      {arrendamientoDetails && (
        <div style={{ marginTop: "20px" }}>
          <h3>{arrendamientoDetails}</h3>
        </div>
      )}
    </div>
  );
}
