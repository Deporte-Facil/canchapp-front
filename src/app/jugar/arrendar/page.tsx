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
  Alert,
} from "@mui/material";
import ModalArriendo from "../../lib/ModalArriendo";
import data from "@/data/recintos.json";

// --- INTERFACES ---
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
  fechaDisponible: Date;
  imagen: string;
  canchas: Cancha[];
  modalidad?: "equipo" | "solitario" | "ambos";
}

// --- COMPONENTE DE PAGO ---
interface PaymentComponentProps {
  details: {
    recinto: string;
    fecha: string;
    hora: string;
  };
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

function PaymentComponent({
  details,
  onPaymentSuccess,
  onCancel,
}: PaymentComponentProps) {
  return (
    <Box sx={{ padding: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Confirmar y Pagar Reserva
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">Detalles de tu reserva:</Typography>
        <Typography>
          <strong>Recinto:</strong> {details.recinto}
        </Typography>
        <Typography>
          <strong>Fecha:</strong> {details.fecha}
        </Typography>
        <Typography>
          <strong>Hora:</strong> {details.hora}
        </Typography>
      </Paper>

      <Typography variant="h6">Selecciona un método de pago:</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={onPaymentSuccess}>
          Pagar con Tarjeta de Crédito/Débito (Simulado)
        </Button>
        <Button variant="contained" color="secondary" onClick={onPaymentSuccess}>
          Pagar con PayPal (Simulado)
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onCancel}
          sx={{ marginTop: 2 }}
        >
          Cancelar y Volver
        </Button>
      </Box>
    </Box>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ArrendarRecinto() {
  const { recintos } = data;

  const [tipoDeporte, setTipoDeporte] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [modalidad, setModalidad] = useState<"solitario" | "equipo" | "">("");

  const [modalOpen, setModalOpen] = useState(false);
  const [recintoSeleccionado, setRecintoSeleccionado] = useState<Recinto | null>(null);

  const [viewState, setViewState] = useState<"lista" | "pagando" | "confirmado">("lista");
  const [arrendamientoDetails, setArrendamientoDetails] = useState<any | null>(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState<string | null>(null);

  const deportesDisponibles = useMemo(
    () => [...new Set(recintos.map((r) => r.tipoDeporte))],
    [recintos]
  );

  const ubicacionesDisponibles = useMemo(() => {
    if (!tipoDeporte) return [];
    return [
      ...new Set(
        recintos
          .filter((r) => r.tipoDeporte === tipoDeporte)
          .map((r) => r.ubicacion)
      ),
    ];
  }, [recintos, tipoDeporte]);

  const recintosFiltrados = useMemo(() => {
    return recintos.filter((recinto) => {
      const matchDeporte = tipoDeporte ? recinto.tipoDeporte === tipoDeporte : true;
      const matchUbicacion = ubicacion ? recinto.ubicacion === ubicacion : true;
      const matchModalidad = modalidad
        ? recinto.modalidad === modalidad || recinto.modalidad === "ambos"
        : true;
      return matchDeporte && matchUbicacion && matchModalidad;
    });
  }, [recintos, tipoDeporte, ubicacion, modalidad]);

  const handleDeporteChange = (event: SelectChangeEvent) => {
    setTipoDeporte(event.target.value as string);
    setUbicacion("");
  };

  const handleUbicacionChange = (event: SelectChangeEvent) => {
    setUbicacion(event.target.value as string);
  };

  const handleModalidadChange = (event: SelectChangeEvent) => {
    setModalidad(event.target.value as "solitario" | "equipo" | "");
  };

  const handleOpenModal = (recinto: Recinto) => {
    setRecintoSeleccionado(recinto);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRecintoSeleccionado(null);
  };

  const handleConfirmArrendamiento = (details: {
    recinto: string;
    fecha: string;
    hora: string;
  }) => {
    setArrendamientoDetails(details);
    setViewState("pagando");
    handleCloseModal();
  };

  const handlePaymentSuccess = () => {
    setMensajeConfirmacion(
      `¡Pago exitoso y arriendo confirmado! Recinto: ${arrendamientoDetails.recinto} para el ${arrendamientoDetails.fecha} a las ${arrendamientoDetails.hora}.`
    );
    setViewState("confirmado");
  };

  const handleCancelPayment = () => {
    setViewState("lista");
    setArrendamientoDetails(null);
  };

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {/* Vista Lista */}
      {viewState === "lista" && (
        <>
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
            <FormControl fullWidth>
              <InputLabel id="deporte-select-label">Selecciona un deporte</InputLabel>
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

            <FormControl fullWidth disabled={!tipoDeporte}>
              <InputLabel id="ubicacion-select-label">Selecciona una ubicación</InputLabel>
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

            <FormControl fullWidth>
              <InputLabel id="modalidad-select-label">Modalidad</InputLabel>
              <Select
                labelId="modalidad-select-label"
                value={modalidad}
                label="Modalidad"
                onChange={handleModalidadChange}
              >
                <MenuItem value="">
                  <em>Todas las modalidades</em>
                </MenuItem>
                <MenuItem value="solitario">Solitario</MenuItem>
                <MenuItem value="equipo">Equipo</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                    <TableCell component="th" scope="row">{recinto.nombre}</TableCell>
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
        </>
      )}

      {/* Vista Pago */}
      {viewState === "pagando" && arrendamientoDetails && (
        <PaymentComponent
          details={arrendamientoDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handleCancelPayment}
        />
      )}

      {/* Vista Confirmación */}
      {viewState === "confirmado" && (
        <Alert severity="success" sx={{ marginTop: 3 }}>
          {mensajeConfirmacion}
          <Button
            onClick={() => setViewState("lista")}
            sx={{ marginLeft: 2 }}
            variant="outlined"
          >
            Arrendar otro recinto
          </Button>
        </Alert>
      )}

      {/* Modal de arriendo */}
      {recintoSeleccionado && (
        <ModalArriendo
          open={modalOpen}
          onClose={handleCloseModal}
          recinto={recintoSeleccionado}
          onConfirm={handleConfirmArrendamiento}
          tipo={modalidad as "solitario" | "equipo"}
        />
      )}
    </Box>
  );
}
