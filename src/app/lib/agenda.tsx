import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface AgendaProps {
  onClose: () => void;
  onConfirm: (
    date: Date,
    time: Date,
    equipo: string | null,
    buscandoRival: string
  ) => void;
  isTeamBooking?: boolean;
}

export default function Agenda({
  onClose,
  onConfirm,
  isTeamBooking = false,
}: AgendaProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [equipo, setEquipo] = useState("");
  const [buscandoRival, setBuscandoRival] = useState(false);

  // Maneja cuando se hace click en calendario para elegir fecha/hora
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setShowForm(true);
  };

  // Confirmar reserva
  const handleConfirm = () => {
    if (!selectedDate) return;

    onConfirm(
      selectedDate,
      selectedDate, // o separar fecha y hora si quieres
      equipo.trim() === "" ? null : equipo.trim(),
      buscandoRival ? "Sí" : "No"
    );
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Agenda de Recintos Deportivos</DialogTitle>
      <DialogContent>
        {!showForm && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            selectable={true}
            dateClick={handleDateClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            slotDuration="01:00:00"
            slotLabelInterval="01:00"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            slotMinTime="09:00:00"
            slotMaxTime="23:00:00"
            height="auto"
          />
        )}

        {showForm && selectedDate && (
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Fecha y hora seleccionada"
              value={selectedDate.toLocaleString()}
              disabled
              fullWidth
            />
            {isTeamBooking && (
              <TextField
                label="Nombre del equipo"
                value={equipo}
                onChange={(e) => setEquipo(e.target.value)}
                fullWidth
              />
            )}
            {isTeamBooking && (
              <Box>
                <label>
                  <input
                    type="checkbox"
                    checked={buscandoRival}
                    onChange={(e) => setBuscandoRival(e.target.checked)}
                  />{" "}
                  Buscando rival
                </label>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {showForm ? (
          <>
            <Button onClick={() => setShowForm(false)}>Volver</Button>
            <Button onClick={handleConfirm} variant="contained" color="primary">
              Confirmar Reserva
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Cerrar</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
