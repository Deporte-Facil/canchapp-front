// src/components/GestionEquipos.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  TextField,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  SportsEsports as SportsEsportsIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";

// --- DATOS DE EJEMPLO (REEMPLAZAR CON DATOS REALES) ---
const MI_CODIGO_AMIGO = "USR-X7B9-2K4D";

const mockTeams = [
  { id: 1, name: "Los Invencibles", members: 5, sport: "Fútbol" },
  { id: 2, name: "Furia Roja", members: 7, sport: "Fútbol" },
  { id: 3, name: "Titanes del Baloncesto", members: 5, sport: "Baloncesto" },
];

const mockFriends = [
  { id: 1, name: "Carlos Vera", avatar: "/avatars/carlos.jpg" },
  { id: 2, name: "Ana Torres", avatar: "/avatars/ana.jpg" },
  { id: 3, name: "Pedro Pascal", avatar: "/avatars/pedro.jpg" },
];

// --- INTERFAZ DEL COMPONENTE ---
export default function GestionEquipos() {
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(MI_CODIGO_AMIGO);
    setSnackbarOpen(true);
  };

  const handleAddFriend = () => {
    // Aquí iría la lógica para buscar y añadir al amigo por su código
    console.log("Buscando y añadiendo amigo...");
    // Muestra una alerta o feedback al usuario
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Equipos y Amigos
      </Typography>

      {/* Pestañas de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab icon={<SportsEsportsIcon />} label="Mis Equipos" />
          <Tab icon={<PeopleIcon />} label="Mis Amigos" />
          <Tab icon={<PersonAddIcon />} label="Añadir Amigo" />
        </Tabs>
      </Box>

      {/* Contenido de la Pestaña "Mis Equipos" */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {mockTeams.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {team.name}
                  </Typography>
                  <Typography color="text.secondary">{team.sport}</Typography>
                  <Typography variant="body2">
                    {team.members} miembros
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Ver Equipo</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" fullWidth>
              Crear Nuevo Equipo
            </Button>
          </Grid>
        </Grid>
      )}

      {/* Contenido de la Pestaña "Mis Amigos" */}
      {tabIndex === 1 && (
        <Box>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "primary.light",
              color: "primary.contrastText",
            }}
          >
            <Typography variant="h6">Tu Código de Amigo</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography
                fontFamily="monospace"
                sx={{ flexGrow: 1, fontSize: "1.2rem" }}
              >
                {MI_CODIGO_AMIGO}
              </Typography>
              <Tooltip title="Copiar código">
                <IconButton onClick={handleCopyCode} color="inherit">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Lista de Amigos
          </Typography>
          <List>
            {mockFriends.map((friend) => (
              <ListItem
                key={friend.id}
                secondaryAction={
                  <Tooltip title="Eliminar amigo">
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar src={friend.avatar}>{friend.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Contenido de la Pestaña "Añadir Amigo" */}
      {tabIndex === 2 && (
        <Paper
          component="form"
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h6">Añadir con Código de Amigo</Typography>
          <Typography variant="body2" color="text.secondary">
            Pide a tu amigo su código único e ingrésalo aquí para enviarle una
            solicitud de amistad.
          </Typography>
          <TextField
            fullWidth
            label="Código de Amigo"
            variant="outlined"
            placeholder="Ej: USR-XXXX-XXXX"
          />
          <Button variant="contained" color="primary" onClick={handleAddFriend}>
            Enviar Solicitud
          </Button>
        </Paper>
      )}

      {/* Notificación de "Copiado" */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Código de amigo copiado al portapapeles!
        </Alert>
      </Snackbar>
    </Container>
  );
}
