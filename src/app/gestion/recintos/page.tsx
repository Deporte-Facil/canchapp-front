"use client";  // Aseguramos que este archivo sea tratado como un componente del cliente

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, ListItemText, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';  // Importa DateTimePicker y LocalizationProvider
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  // Importa el adaptador de date-fns
import { PhotoCamera, Delete } from '@mui/icons-material';  // Para el ícono de borrar

// Asegúrate de importar solo desde MUI
import { FormControlLabel, Checkbox } from '@mui/material';

const RegistrarRecinto = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '', // Nombre del recinto
    tipoDeporte: '', // Tipo de deporte
    jugadoresMax: '', // Número máximo de jugadores
    costo: '', // Costo de arrendar el recinto
    descripcion: '', // Descripción del recinto
    materiales: '', // Materiales disponibles
    ubicacion: '', // Ubicación del recinto
    estacionamiento: false, // Estacionamiento disponible
    petos: false, // Petos disponibles
    arbitros: false, // Árbitros disponibles
    servicios: [], // Servicios adicionales seleccionados
    fechaDisponible: new Date(),  // Fecha y hora seleccionada
    imagen: '', // URL de la imagen
    canchas: [{ tipoCancha: '', cantidad: 1, horariosDisponibles: '', materialesCancha: '' }],  // Array para manejar las canchas y sus detalles
  });

  const router = useRouter();

  // Manejador para cambios en los campos de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejador para el cambio en los servicios seleccionados
  const handleServicioChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({
      ...formData,
      servicios: e.target.value as string[]
    });
  };

  // Manejador para el cambio en la fecha y hora seleccionada
  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      fechaDisponible: date || new Date()
    });
  };

  // Manejador para el cambio en el tipo, cantidad y otros detalles de las canchas
  const handleCanchaChange = (index: number, field: string, value: any) => {
    const newCanchas = [...formData.canchas];
    newCanchas[index][field] = value;
    setFormData({
      ...formData,
      canchas: newCanchas
    });
  };

  // Manejador para agregar una nueva cancha
  const handleAddCancha = () => {
    setFormData({
      ...formData,
      canchas: [...formData.canchas, { tipoCancha: '', cantidad: 1, horariosDisponibles: '', materialesCancha: '' }],
    });
  };

  // Manejador para eliminar una cancha
  const handleRemoveCancha = (index: number) => {
    const newCanchas = formData.canchas.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      canchas: newCanchas
    });
  };

  // Manejador para el cambio de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        imagen: imageUrl
      });
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para registrar el recinto en el backend (API, base de datos, etc.)
    console.log(formData);  // Para visualizar los datos en la consola (por ahora)
    alert('Recinto registrado correctamente');
    router.push('/recintos');  // Redirige a la página de recintos registrados
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', paddingTop: 2 }}>
      <Typography variant="h4" gutterBottom>Registrar Recinto Deportivo</Typography>
      <form onSubmit={handleSubmit}>
        
        {/* Nombre del recinto */}
        <TextField
          label="Nombre del recinto"
          variant="outlined"
          fullWidth
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Tipo de deporte */}
        <TextField
          label="Tipo de deporte"
          variant="outlined"
          fullWidth
          name="tipoDeporte"
          value={formData.tipoDeporte}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Número máximo de jugadores */}
        <TextField
          label="Número máximo de jugadores"
          variant="outlined"
          fullWidth
          name="jugadoresMax"
          type="number"
          value={formData.jugadoresMax}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Costo */}
        <TextField
          label="Costo del arrendamiento"
          variant="outlined"
          fullWidth
          name="costo"
          type="number"
          value={formData.costo}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Descripción */}
        <TextField
          label="Descripción del recinto"
          variant="outlined"
          fullWidth
          name="descripcion"
          multiline
          rows={4}
          value={formData.descripcion}
          onChange={handleInputChange}
          margin="normal"
        />

        {/* Ubicación */}
        <TextField
          label="Ubicación del recinto"
          variant="outlined"
          fullWidth
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Materiales disponibles */}
        <TextField
          label="Materiales disponibles"
          variant="outlined"
          fullWidth
          name="materiales"
          value={formData.materiales}
          onChange={handleInputChange}
          required
          margin="normal"
        />

        {/* Estacionamiento, petos, árbitros */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.estacionamiento}
              onChange={(e) => setFormData({ ...formData, estacionamiento: e.target.checked })}
            />
          }
          label="Estacionamiento disponible"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.petos}
              onChange={(e) => setFormData({ ...formData, petos: e.target.checked })}
            />
          }
          label="Petos disponibles"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.arbitros}
              onChange={(e) => setFormData({ ...formData, arbitros: e.target.checked })}
            />
          }
          label="Árbitros disponibles"
        />

        {/* Servicios adicionales */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Servicios adicionales</InputLabel>
          <Select
            multiple
            name="servicios"
            value={formData.servicios}
            onChange={handleServicioChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {['Vestuarios', 'Luces', 'Zona de descanso', 'Baños', 'Estacionamiento'].map((servicio) => (
              <MenuItem key={servicio} value={servicio}>
                <Checkbox checked={formData.servicios.indexOf(servicio) > -1} />
                <ListItemText primary={servicio} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subir imagen del recinto */}
        <Box sx={{ marginTop: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-image"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Subir Imagen del Recinto
            </Button>
          </label>
          {formData.imagen && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body2">Vista previa:</Typography>
              <img src={formData.imagen} alt="Vista previa" width="100%" />
            </Box>
          )}
        </Box>

        {/* Selección de fecha y hora */}
        <Typography variant="h6" sx={{ marginTop: 2 }}>Selecciona una fecha y hora de disponibilidad</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            onChange={handleDateChange}  // Maneja el cambio de fecha
            value={formData.fechaDisponible}  // Muestra la fecha seleccionada
            disableClock  // Opcional: desactiva el reloj de hora
            renderInput={(props) => <TextField {...props} />}  // Personaliza el input con un TextField
          />
        </LocalizationProvider>

        {/* Agregar canchas */}
        <Typography variant="h6" sx={{ marginTop: 2 }}>Agregar Canchas</Typography>
        {formData.canchas.map((cancha, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              label="Tipo de Cancha"
              variant="outlined"
              fullWidth
              name="tipoCancha"
              value={cancha.tipoCancha}
              onChange={(e) => handleCanchaChange(index, 'tipoCancha', e.target.value)}
              margin="normal"
            />
            <TextField
              label="Cantidad de Canchas"
              variant="outlined"
              fullWidth
              name="cantidad"
              type="number"
              value={cancha.cantidad}
              onChange={(e) => handleCanchaChange(index, 'cantidad', e.target.value)}
              margin="normal"
            />
            <TextField
              label="Horarios Disponibles"
              variant="outlined"
              fullWidth
              name="horariosDisponibles"
              value={cancha.horariosDisponibles}
              onChange={(e) => handleCanchaChange(index, 'horariosDisponibles', e.target.value)}
              margin="normal"
            />
            <TextField
              label="Materiales para la Cancha"
              variant="outlined"
              fullWidth
              name="materialesCancha"
              value={cancha.materialesCancha}
              onChange={(e) => handleCanchaChange(index, 'materialesCancha', e.target.value)}
              margin="normal"
            />
            <IconButton onClick={() => handleRemoveCancha(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddCancha} sx={{ marginBottom: 2 }}>
          Agregar otra cancha
        </Button>

        {/* Botón para registrar el recinto */}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
          Registrar Recinto
        </Button>
      </form>
    </Box>
  );
};

export default RegistrarRecinto;
