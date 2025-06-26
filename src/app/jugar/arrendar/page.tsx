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
  Typography,
  Alert, // Importamos Alert para un mensaje más vistoso
} from "@mui/material";
import ModalArriendo from "../../lib/ModalArriendo"; // Asegúrate que la ruta sea correcta
import data from "@/data/recintos.json"; // <-- ¡Esta es la nueva importación!

// INTERFACES: Definen la "forma" de nuestros datos para asegurar consistencia.
// Deben ser idénticas a las que usamos en el formulario de registro y en el modal.
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
  materiales: string; // <--- Campo añadido
  ubicacion: string;
  estacionamiento: boolean; // <--- Corregido de string a boolean
  petos: boolean; // <--- Corregido de string a boolean
  arbitros: boolean; // <--- Corregido de string a boolean
  servicios: string[];
  fechaDisponible: Date; // <--- Corregido el nombre y el tipo
  imagen: string;
  canchas: Cancha[];
}

// COMPONENTE PRINCIPAL
export default function ArrendarRecinto() {
  // ESTADO: Almacena los datos que cambian en el componente.
  const { recintos } = data; // Extraemos la lista de recintos desde el archivo JSON
  const [tipoDeporte, setTipoDeporte] = useState<string>(""); // Filtro de deporte seleccionado
  const [ubicacion, setUbicacion] = useState<string>(""); // Filtro de ubicación seleccionado
  const [modalOpen, setModalOpen] = useState(false); // Controla si el modal está visible o no
  const [recintoSeleccionado, setRecintoSeleccionado] =
    useState<Recinto | null>(null); // Guarda el recinto que el usuario quiere arrendar
  const [arrendamientoDetails, setArrendamientoDetails] = useState<
    string | null
  >(null); // Mensaje de confirmación del arriendo

  // DATOS MEMOIZADOS: Cálculos que se ejecutan solo cuando sus dependencias cambian, para optimizar el rendimiento.
  const deportesDisponibles = useMemo(
    () => [...new Set(recintos.map((r) => r.tipoDeporte))],
    [recintos]
  );

  const ubicacionesDisponibles = useMemo(() => {
    if (!tipoDeporte) return []; // Si no hay deporte seleccionado, no hay ubicaciones que mostrar
    return [
      ...new Set(
        recintos
          .filter((r) => r.tipoDeporte === tipoDeporte)
          .map((r) => r.ubicacion)
      ),
    ];
  }, [recintos, tipoDeporte]);

  const recintosFiltrados = useMemo(() => {
    // Si no hay filtros, muestra todos los recintos.
    if (!tipoDeporte && !ubicacion) {
      return recintos;
    }
    return recintos.filter((recinto) => {
      const matchDeporte = tipoDeporte
        ? recinto.tipoDeporte === tipoDeporte
        : true;
      const matchUbicacion = ubicacion ? recinto.ubicacion === ubicacion : true;
      return matchDeporte && matchUbicacion;
    });
  }, [recintos, tipoDeporte, ubicacion]);

  // MANEJADORES DE EVENTOS: Funciones que responden a las acciones del usuario.
  const handleDeporteChange = (event: SelectChangeEvent) => {
    setTipoDeporte(event.target.value as string);
    setUbicacion(""); // Reseteamos la ubicación para que el usuario elija de nuevo.
  };

  const handleUbicacionChange = (event: SelectChangeEvent) => {
    setUbicacion(event.target.value as string);
  };

  // Abre el modal y le pasa los datos del recinto seleccionado.
  const handleOpenModal = (recinto: Recinto) => {
    setRecintoSeleccionado(recinto);
    setModalOpen(true);
  };

  // Cierra el modal y limpia el estado.
  const handleCloseModal = () => {
    setModalOpen(false);
    setRecintoSeleccionado(null);
  };

  // Se ejecuta cuando el usuario confirma el arriendo desde el modal.
  const handleConfirmArrendamiento = (details: {
    recinto: string;
    fecha: string;
    hora: string;
  }) => {
    setArrendamientoDetails(
      `¡Arriendo confirmado! Recinto: ${details.recinto} para el ${details.fecha} a las ${details.hora}.`
    );
    handleCloseModal(); // Cierra el modal después de confirmar.
  };

  // RENDERIZACIÓN: Lo que se muestra en la pantalla.
  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Arrendar Recintos Deportivos
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          marginBottom: 3,
        }}
      >
        {/* Filtro de Deporte */}
        <FormControl fullWidth>
          <InputLabel id="deporte-select-label">
            Selecciona un deporte
          </InputLabel>
          <Select
            labelId="deporte-select-label"
            value={tipoDeporte}
            label="Selecciona un deporte"
            onChange={handleDeporteChange}
          >
            <MenuItem value="">
              <em>Todos los deportes</em>
            </MenuItem>
            {deportesDisponibles.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Ubicación */}
        <FormControl
          fullWidth
          disabled={!tipoDeporte && deportesDisponibles.length > 0}
        >
          <InputLabel id="ubicacion-select-label">
            Selecciona una ubicación
          </InputLabel>
          <Select
            labelId="ubicacion-select-label"
            value={ubicacion}
            label="Selecciona una ubicación"
            onChange={handleUbicacionChange}
          >
            <MenuItem value="">
              <em>Todas las ubicaciones</em>
            </MenuItem>
            {ubicacionesDisponibles.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tabla de Recintos */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de recintos">
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Recinto</TableCell>
              <TableCell>Deporte</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell align="right">Costo por hora</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recintosFiltrados.map((recinto) => (
              <TableRow key={recinto.nombre} hover>
                <TableCell component="th" scope="row">
                  {recinto.nombre}
                </TableCell>
                <TableCell>{recinto.tipoDeporte}</TableCell>
                <TableCell>{recinto.ubicacion}</TableCell>
                <TableCell align="right">
                  ${parseInt(recinto.costo, 10).toLocaleString("es-CL")}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(recinto)}
                  >
                    Arrendar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mensaje de confirmación */}
      {arrendamientoDetails && (
        <Alert severity="success" sx={{ marginTop: 3 }}>
          {arrendamientoDetails}
        </Alert>
      )}

      {/* Renderizado condicional del Modal */}
      {recintoSeleccionado && (
        <ModalArriendo
          open={modalOpen}
          onClose={handleCloseModal}
          recinto={recintoSeleccionado}
          onConfirm={handleConfirmArrendamiento}
        />
      )}
    </Box>
  );
}
