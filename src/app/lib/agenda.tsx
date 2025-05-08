import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment-timezone';


moment.locale('es');  // Configura moment para usar español

function Agenda() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    name: '',
    description: '',
    start: '',
    end: '',
    team: '',
  });

  const handleClickOpen = (info: any) => {
    setReservationDetails({
      name: '',
      description: '',
      start: info.dateStr,
      end: info.dateStr,
      team: '',
    });
    setOpen(true);
  };

  
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReservationDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmBooking = () => {
    const startDate = moment.tz(reservationDetails.start, "America/Santiago").toDate();
    const endDate = moment.tz(reservationDetails.end, "America/Santiago").toDate();
    const newEvent = {
      title: reservationDetails.name,
      start: new Date(reservationDetails.start),
      end: new Date(reservationDetails.end),
      description: reservationDetails.description,
      team: reservationDetails.team,
    };

    setEvents([...events, newEvent]);
    setOpen(false);
  };

  const handleEventClick = (info: any) => {
    if (window.confirm(`¿Deseas eliminar la reserva para ${info.event.title}?`)) {
      info.event.remove();
    }
  };

  return (
    <div style={{ width: '80%', margin: 'auto', marginTop: '30px'}}>
      <center><h2>Agenda de Recintos Deportivos</h2></center>
      <FullCalendar
        
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        dateClick={handleClickOpen}
        eventClick={handleEventClick}
        locale="es"
        timeZone="America/Santiago"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        // Limitar los bloques de tiempo a 1 hora
        slotDuration="01:00:00"  // Bloques de 1 hora
        slotLabelInterval="01:00"
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}  // Formato de 24 horas
        slotMinTime="09:00:00"  // Configura la hora mínima (por ejemplo, 9:00 AM)
        slotMaxTime="23:00:00"  // Configura la hora máxima (por ejemplo, 6:00 PM)
        // Evitar la selección de horas no completas
        selectable={true}
        selectMirror={true}
        height="auto"
      />

      {/* Modal para rellenar los datos de la reserva */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Detalles de la Reserva</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Encargado de la reserva"
            type="text"
            fullWidth
            variant="outlined"
            value={reservationDetails.name}
            onChange={handleInputChange}
            name="title"
          />
          <TextField
            margin="dense"
            id="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="outlined"
            value={reservationDetails.description}
            onChange={handleInputChange}
            name="description"
          />
          <TextField
            margin="dense"
            id="start"
            label="Fecha de Inicio"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={reservationDetails.start}
            onChange={handleInputChange}
            name="start"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="end"
            label="Fecha de Fin"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={reservationDetails.end}
            onChange={handleInputChange}
            name="end"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Equipo</InputLabel>
            <Select
              value={reservationDetails.team}
              onChange={handleInputChange}
              name="team"
              label="Seleccionar equipo"
            >
              <MenuItem value="">
                <em>Sin equipo</em>
              </MenuItem>
              <MenuItem value="Equipo A">Equipo A</MenuItem>
              <MenuItem value="Equipo B">Equipo B</MenuItem>
              <MenuItem value="Equipo C">Equipo C</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmBooking} color="primary">
            Confirmar Reserva
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Agenda;
