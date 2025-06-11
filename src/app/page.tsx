"use client";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top left, #fdd835, #f5f5f5)",
        padding: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="center">
          <Card sx={{ boxShadow: 6 }}>
            <CardActionArea onClick={() => router.push("/jugar")}>
              <CardMedia
                component="img"
                height="600"
                image="/jugador.png"
                alt="Jugador"
              />
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold">Jugador</Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

          <Card sx={{ boxShadow: 6 }}>
            <CardActionArea onClick={() => router.push("/gestion")}>
              <CardMedia
                component="img"
                height="600"
                image="/arrendatario.png"
                alt="Arrendatario"
              />
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold">Arrendatario</Typography>
              </Box>
            </CardActionArea>
          </Card>
    </Box>
  );
}
