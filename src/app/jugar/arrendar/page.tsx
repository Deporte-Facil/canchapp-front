"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import Agenda from "../../lib/agenda";
import recintos from "../../data/recintos.json";
type Deportes = keyof typeof recintos;
interface Recinto {
  nombre: string;
  valor: number | string; // según cómo esté en tu JSON, puede ser número o cadena
  ubicacion: string;
}

export default function Jugadores() {
  const [deporte, setDeporte] = useState<Deportes | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [arrendamientoDetails, setArrendamientoDetails] = useState<
    string | null
  >(null);

  const handleChange = (event: SelectChangeEvent) => {
    setDeporte(event.target.value as Deportes);
  };

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

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="deporte-selector-label">
          Selecciona un deporte
        </InputLabel>
        <Select
          labelId="deporte-selector-label"
          id="deporte-selector"
          value={deporte}
          label="Selecciona un deporte"
          onChange={handleChange}
        >
          {Object.keys(recintos).map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {deporte && recintos[deporte] && (
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
              {recintos[deporte].map((row: Recinto, index: number) => (
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
