import { Box, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(255,255,255,0.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 2000,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
