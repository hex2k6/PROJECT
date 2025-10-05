import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from "@mui/material";

type Props = {
  open: boolean;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  content = "Bạn có đồng ý với thao tác này không?",
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button variant="contained" onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}
