"use client";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import { useState, ReactNode } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DomainVerificationIcon from '@mui/icons-material/DomainVerification'; // Ícono para la nueva opción
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";

type Anchor = "top" | "left" | "bottom" | "right";

// Estructura para manejar los ítems del menú de forma más ordenada
const menuItems = [
  { text: "Registrar Recinto", icon: <InboxIcon />, path: "/gestion/recintos" },
  { text: "Gestionar Reservas", icon: <DomainVerificationIcon />, path: "/gestion/reservas" },
  // Puedes añadir más ítems aquí en el futuro
];

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleDrawerButtonClick = (path: string) => {
    router.push(path);
  };

  const [state, setState] = useState({ left: false });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              onClick={() => handleDrawerButtonClick(item.path)}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Panel de Gestión
          </Typography>
          <Button onClick={() => router.push("/")} color="inherit">
            VOLVER AL PORTAL
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        {list("left")}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        {children}
      </Box>
    </>
  );
};

export default Layout;