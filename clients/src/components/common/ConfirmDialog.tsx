import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  description,
  confirmText = "Xóa",
  cancelText = "Hủy",
  loading,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0.5,
        },
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ px: 2, pt: 2, pb: 1 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#ffe7e5",
            color: "#e5483f",
            mr: 1.25,
          }}
        >
          <ErrorOutlineRoundedIcon fontSize="small" />
        </Avatar>

        <DialogTitle
          component="h3"
          sx={{ p: 0, fontSize: 16, fontWeight: 700, flex: 1 }}
        >
          {title}
        </DialogTitle>

        <IconButton edge="end" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <DialogContent sx={{ pt: 0, px: 2, pb: 1.5 }}>
        {typeof description === "string" ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : (
          description
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            bgcolor: "#fff",
            borderColor: theme.palette.grey[300],
            "&:hover": { bgcolor: "#fafafa" },
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: "#ff6a3d",
            "&:hover": { bgcolor: "#f25a2b" },
            boxShadow: "none",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
