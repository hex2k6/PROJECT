import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, Typography, MenuItem, Select, FormControl, RadioGroup,
  Radio, FormControlLabel
} from "@mui/material";
import { useEffect, useState } from "react";
import type { LessonStatus } from "../../store/lessonsSlice";
import type { Course } from "../../store/coursesSlice";

type Props = {
  open: boolean;
  subjects: Course[];                             // để chọn môn học
  initial?: {
    id?: number;
    subject_id?: number;
    lesson_name?: string;
    time?: number;
    status?: LessonStatus;
  };
  onClose: () => void;
  onSubmit: (data: { subject_id: number; lesson_name: string; time: number; status: LessonStatus }) => void;
};

export default function LessonFormDialog({ open, subjects, initial, onClose, onSubmit }: Props) {
  const isEdit = Boolean(initial?.id);

  const [subjectId, setSubjectId]   = useState<number>(initial?.subject_id ?? subjects[0]?.id ?? 0);
  const [name, setName]             = useState(initial?.lesson_name ?? "");
  const [time, setTime]             = useState<number>(initial?.time ?? 45);
  const [status, setStatus]         = useState<LessonStatus>(initial?.status ?? "incomplete");

  const [touched, setTouched]       = useState(false);
  const nameError = touched && !name.trim();
  const timeError = touched && (!time || time <= 0);

  useEffect(() => {
    setSubjectId(initial?.subject_id ?? subjects[0]?.id ?? 0);
    setName(initial?.lesson_name ?? "");
    setTime(initial?.time ?? 45);
    setStatus(initial?.status ?? "incomplete");
    setTouched(false);
  }, [open, initial, subjects]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Sửa bài học" : "Thêm mới bài học"}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Môn học</Typography>
            <FormControl fullWidth>
              <Select
                value={subjectId}
                onChange={(e) => setSubjectId(Number(e.target.value))}
              >
                {subjects.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.subject_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Tên bài học</Typography>
            <TextField
              fullWidth
              value={name}
              onBlur={() => setTouched(true)}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError ? "Tên bài học không được để trống" : " "}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Thời gian học (phút)</Typography>
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              value={time}
              onBlur={() => setTouched(true)}
              onChange={(e) => setTime(Number(e.target.value))}
              error={!!timeError}
              helperText={timeError ? "Thời gian phải lớn hơn 0" : " "}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Trạng thái</Typography>
            <RadioGroup row value={status} onChange={(e)=>setStatus(e.target.value as LessonStatus)}>
              <FormControlLabel value="completed"  control={<Radio />} label="Đã hoàn thành" />
              <FormControlLabel value="incomplete" control={<Radio />} label="Chưa hoàn thành" />
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
            if (!name.trim() || !time || time <= 0 || !subjectId) return;
            onSubmit({ subject_id: subjectId, lesson_name: name.trim(), time, status });
          }}
        >
          {isEdit ? "Lưu" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
