import * as React from "react";
import {
  Snackbar,
  Paper,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type ToastProps = {
  open: boolean;
  title?: string;
  message?: string;
  autoHideDuration?: number;
  onClose: () => void;
};

export default function Toast({
  open,
  title = "Thành công",
  message,
  autoHideDuration = 1000,
  onClose,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ zIndex: (t) => t.zIndex.snackbar + 1 }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#2E3853",
          color: "#fff",
          px: 2.5,
          py: 2,
          borderRadius: 2,
          minWidth: 360,
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1.5}>
          <CheckCircleRoundedIcon sx={{ color: "#2ce47a", mt: "2px" }} />

          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700}>{title}</Typography>
            {message && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {message}
              </Typography>
            )}
          </Stack>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </Snackbar>
  );
}
