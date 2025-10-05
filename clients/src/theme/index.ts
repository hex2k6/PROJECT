import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    grey: { 100: "#f5f7fb" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            height: 44, // ~44px tap target
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          height: 44,
          textTransform: "none",
          fontSize: 16,
          borderRadius: 10,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f7fb",
        },
      },
    },
  },
});
