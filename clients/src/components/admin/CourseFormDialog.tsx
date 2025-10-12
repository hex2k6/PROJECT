import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, RadioGroup, FormControlLabel, Radio, Stack, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Course, CourseStatus } from "../../store/coursesSlice";

type Props = {
  open: boolean;
  initial?: Partial<Course>;
  onClose: () => void;
  // ⬅️ onSubmit bây giờ trả { subject_name, status } để khớp server
  onSubmit: (data: { subject_name: string; status: CourseStatus }) => void;
};

export default function CourseFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const isEdit = Boolean(initial?.id);

  // ⬅️ lấy từ subject_name (vẫn hiển thị 1 ô text như cũ)
  const [subjectName, setSubjectName] = useState(initial?.subject_name ?? "");
  const [status, setStatus] = useState<CourseStatus>(initial?.status ?? "active");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setSubjectName(initial?.subject_name ?? "");
    setStatus(initial?.status ?? "active");
    setTouched(false);
  }, [open, initial]);

  const nameError = touched && !subjectName.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Sửa môn học" : "Thêm mới môn học"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Tên môn học</Typography>
            <TextField
              fullWidth
              value={subjectName}
              onBlur={() => setTouched(true)}
              onChange={(e) => setSubjectName(e.target.value)}
              error={!!nameError}
              helperText={nameError ? "Tên môn học không được để trống" : " "}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Trạng thái</Typography>
            <RadioGroup
              row
              value={status}
              onChange={(e) => setStatus(e.target.value as CourseStatus)}
            >
              <FormControlLabel value="active"   control={<Radio />} label="Đang hoạt động" />
              <FormControlLabel value="inactive" control={<Radio />} label="Ngừng hoạt động" />
            </RadioGroup>
          </div>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={() => {
            setTouched(true);
            if (!subjectName.trim()) return;
            // ⬅️ gửi đúng shape cho slice/server
            onSubmit({ subject_name: subjectName.trim(), status });
          }}
        >
          {isEdit ? "Lưu" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
