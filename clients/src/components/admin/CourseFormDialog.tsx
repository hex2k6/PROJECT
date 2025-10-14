// src/components/admin/CourseFormDialog.tsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, RadioGroup, FormControlLabel, Radio, Stack, Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { Course, CourseStatus } from "../../store/coursesSlice";

type Props = {
  open: boolean;
  initial?: Partial<Course>;
  onClose: () => void;
  // Gửi đúng shape về slice/server
  onSubmit: (data: { subject_name: string; status: CourseStatus }) => void;
  // ⬇️ danh sách hiện có để kiểm tra trùng tên (tùy chọn để không phá chỗ cũ)
  existing?: Course[];
};

export default function CourseFormDialog({ open, initial, onClose, onSubmit, existing }: Props) {
  const isEdit = Boolean(initial?.id);
  const [subjectName, setSubjectName] = useState(initial?.subject_name ?? "");
  const [status, setStatus] = useState<CourseStatus>(initial?.status ?? "active");
  const [touched, setTouched] = useState(false);
  const [dupError, setDupError] = useState<string | null>(null);

  // Chuẩn hoá chuỗi để so trùng
  const norm = (s: string) => s.trim().toLowerCase();

  // Kiểm tra trùng tên theo existing
  const isDuplicate = useMemo(() => {
    if (!existing || !subjectName.trim()) return false;
    const target = norm(subjectName);
    return existing.some(
      (c) => norm(c.subject_name) === target && (!isEdit || c.id !== initial?.id)
    );
  }, [existing, subjectName, isEdit, initial?.id]);

  useEffect(() => {
    setSubjectName(initial?.subject_name ?? "");
    setStatus(initial?.status ?? "active");
    setTouched(false);
    setDupError(null);
  }, [open, initial]);

  useEffect(() => {
    if (!touched) return;
    if (!subjectName.trim()) setDupError("Tên môn học không được để trống");
    else if (isDuplicate) setDupError("Tên môn học đã tồn tại");
    else setDupError(null);
  }, [touched, subjectName, isDuplicate]);

  const handleSubmit = () => {
    setTouched(true);
    // tính lại lỗi trước khi submit
    let err: string | null = null;
    if (!subjectName.trim()) err = "Tên môn học không được để trống";
    else if (isDuplicate) err = "Tên môn học đã tồn tại";
    setDupError(err);
    if (err) return;

    onSubmit({ subject_name: subjectName.trim(), status });
  };

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
              error={touched && (!!dupError)}
              helperText={touched && dupError ? dupError : " "}
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
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Lưu" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
