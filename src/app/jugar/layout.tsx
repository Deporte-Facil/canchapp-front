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
import { useState, ReactNode, useEffect } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";

type Anchor = "top" | "left" | "bottom" | "right";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const handleDrawerButtonClick = (text: string) => {
    switch (text) {
      case "ARRENDAR":
        router.push("/jugar/arrendar");
        break;
      case "MODIFICAR EQUIPO":
        alert("MODIFICAR EQUIPO");
        //router.push('/main/reports');
        break;
      case "COSA 3":
        //alert("COSA 3")
        router.push("/main/students");
        break;
      case "COSA 4":
        alert("COSA 4");
        //router.push('/main/table');
        break;
      default:
        break;
    }
  };
  const [state, setState] = useState({
    left: false,
  });

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
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["ARRENDAR", "GESTIONAR EQUIPO", "COSA 3", "COSA 4"].map(
          (text, index) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleDrawerButtonClick(text)}
            >
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
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
            Sistema de Seguimientos
          </Typography>
          <Button color="inherit">Cerrar sesión</Button>
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
      <div style={{ paddingTop: "64px" }}>
        {" "}
        {/* Adjust paddingTop to match the height of the AppBar */}
        <main style={{ flex: 1, padding: "20px" }}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
