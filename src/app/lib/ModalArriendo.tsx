"use client";

import React, { useState } from "react";
import {
  Modal, Box, Typography, Button, IconButton, TextField, Divider, Card,
  CardMedia, List, ListItem, ListItemIcon, ListItemText, Chip, Stack, FormControl,
  InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Alert
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"; 
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import SportsIcon from "@mui/icons-material/Sports";

interface Cancha {
  tipoCancha: string;
  cantidad: number;
  horariosDisponibles: string;
  materialesCancha: string;
}

interface Recinto {
  nombre: string;
  tipoDeporte: string;
  jugadoresMax: string;
  costo: string;
  descripcion: string;
  materiales: string;
  ubicacion: string;
  estacionamiento: boolean;
  petos: boolean;
  arbitros: boolean;
  servicios: string[];
  imagen_url: string; 
  canchas?: Cancha[]; 
}

interface ModalArriendoProps {
  open: boolean;
  onClose: () => void;
  recinto: Recinto;
  tipo: string | null;
  onConfirm: (details: {
    recinto: string;
    fecha: Date; 
    hora: string;
    cancha: string;
    colorCamiseta?: string;
  }) => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 500, md: 600 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
};

export default function ModalArriendo({
  open,
  onClose,
  recinto,
  onConfirm,
  tipo,
}: ModalArriendoProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [canchaSeleccionadaIndex, setCanchaSeleccionadaIndex] = useState(0);
  const [colorCamiseta, setColorCamiseta] = useState("");

  const hasCanchas = Array.isArray(recinto.canchas) && recinto.canchas.length > 0;
  const horarios = hasCanchas && recinto.canchas && recinto.canchas[canchaSeleccionadaIndex]
    ? recinto.canchas[canchaSeleccionadaIndex].horariosDisponibles.split(",")
    : [];

  const handleConfirm = () => {
    console.log('--- ModalArriendo: Intentando confirmar ---'); 
    console.log('fechaSeleccionada:', fechaSeleccionada); 
    console.log('horaSeleccionada:', horaSeleccionada); 
    console.log('hasCanchas:', hasCanchas); 
    console.log('recinto.canchas:', recinto.canchas); 
    console.log('tipo:', tipo); 
    console.log('colorCamiseta (si aplica):', tipo === 'equipo' ? colorCamiseta : 'N/A'); 

    const canProceed = fechaSeleccionada && horaSeleccionada && hasCanchas && recinto.canchas && 
                       (tipo !== "equipo" || colorCamiseta); 

    console.log('¿Puede proceder la confirmación?:', canProceed); 

    if (canProceed) {
      console.log('--- ModalArriendo: Llamando a onConfirm (prop) de page.tsx ---'); 
      onConfirm({
        recinto: recinto.nombre,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        cancha: recinto.canchas?.[canchaSeleccionadaIndex]?.tipoCancha || '', 
        ...(tipo === "equipo" && { colorCamiseta }),
      });
    } else {
      console.warn('--- ModalArriendo: La confirmación no se disparó porque faltan datos.'); 
      alert('Por favor, completa todos los campos requeridos para la reserva.'); 
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Card sx={{ mb: 2 }} elevation={0}>
          {recinto.imagen_url && (
            <CardMedia component="img" height="200" image={recinto.imagen_url} alt={recinto.nombre} />
          )}
        </Card>
        
        <Typography variant="h5" fontWeight="bold">{recinto.nombre}</Typography>
        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" sx={{ mb: 2 }}><LocationOnIcon fontSize="small" /><Typography>{recinto.ubicacion}</Typography></Stack>
        <Typography sx={{ mb: 2 }}>{recinto.descripcion}</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-around', gap: 2, mb: 2 }}>
          <Stack alignItems="center" sx={{ flexGrow: 1 }}>
            <SportsSoccerIcon /><Typography>Deporte: {recinto.tipoDeporte}</Typography>
          </Stack>
          <Stack alignItems="center" sx={{ flexGrow: 1 }}>
            <GroupsIcon /><Typography>Max: {recinto.jugadoresMax}</Typography>
          </Stack>
          <Stack alignItems="center" sx={{ flexGrow: 1 }}>
            <PaidIcon /><Typography>Costo: ${parseInt(recinto.costo, 10).toLocaleString("es-CL")} / hr</Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Servicios y Equipamiento</Typography>
        <List dense>
          {recinto.estacionamiento && (<ListItem><ListItemIcon><DirectionsCarIcon /></ListItemIcon><ListItemText primary="Estacionamiento disponible" /></ListItem>)}
          {recinto.petos && (<ListItem><ListItemIcon><CheckroomIcon /></ListItemIcon><ListItemText primary="Petos incluidos" /></ListItem>)}
          {recinto.arbitros && (<ListItem><ListItemIcon><SportsIcon /></ListItemIcon><ListItemText primary="Servicio de árbitros disponible" /></ListItem>)}
          {recinto.materiales && (<ListItem><ListItemIcon><SportsSoccerIcon /></ListItemIcon><ListItemText primary={`Materiales: ${recinto.materiales}`} /></ListItem>)}
        </List>
        {recinto.servicios && recinto.servicios.length > 0 && (<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>{recinto.servicios.map((servicio) => (<Chip key={servicio} label={servicio} size="small" />))}</Stack>)}
        <Divider sx={{ my: 2 }} />

        {hasCanchas ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>Reservar</Typography>
            {recinto.canchas!.length > 1 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Selecciona una cancha</InputLabel>
                <Select value={canchaSeleccionadaIndex} label="Selecciona una cancha" onChange={(e) => setCanchaSeleccionadaIndex(e.target.value as number)}>
                  {recinto.canchas!.map((cancha, index) => (<MenuItem key={index} value={index}>{cancha.tipoCancha}</MenuItem>))}
                </Select>
              </FormControl>
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker label="Selecciona el día" value={fechaSeleccionada} onChange={(nuevaFecha) => { setFechaSeleccionada(nuevaFecha); setHoraSeleccionada(null); }} minDate={new Date()} sx={{ width: '100%' }} /></LocalizationProvider>
            <Typography sx={{ mt: 2, mb: 1 }}>Selecciona un horario:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}> 
              {horarios.map((hora) => (
                <Button
                  key={hora}
                  variant={horaSeleccionada === hora ? "contained" : "outlined"}
                  onClick={() => setHoraSeleccionada(hora)}
                >
                  {hora}
                </Button>
              ))}
            </Box>
          </>
        ) : (
          <Alert severity="warning">Este recinto no tiene canchas disponibles para arrendar en este momento.</Alert>
        )}
        
        {hasCanchas && tipo === "equipo" && (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}><InputLabel>Color de camiseta</InputLabel><Select value={colorCamiseta} label="Color de camiseta" onChange={(e) => setColorCamiseta(e.target.value)}><MenuItem value="Rojo">Rojo</MenuItem><MenuItem value="Azul">Azul</MenuItem></Select></FormControl>
            <TableContainer component={Paper}><Table><TableBody><TableRow><TableCell><strong>Equipo</strong></TableCell><TableCell>Capitán: Tú</TableCell></TableRow><TableRow><TableCell><strong>Equipo Rival</strong></TableCell><TableCell>Busca capitán rival</TableCell></TableRow></TableBody></Table></TableContainer>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirm}
          disabled={!fechaSeleccionada || !horaSeleccionada || !hasCanchas || (tipo === "equipo" && !colorCamiseta)}
        >
          Confirmar Arriendo
        </Button>
      </Box>
    </Modal>
  );
}