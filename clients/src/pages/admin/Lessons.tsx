// src/pages/admin/Lessons.tsx
import {
  Box, Container, Stack, Typography, Select, MenuItem, Button, TextField,
  InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, Chip,
  IconButton, Pagination, Divider, Checkbox
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchCourses, type Course } from "../../store/coursesSlice";
import {
  fetchLessons, addLesson, updateLesson, deleteLesson,
  type Lesson, type LessonStatus
} from "../../store/lessonsSlice";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingScreen from "../../components/common/LoadingScreen";
import Toast from "../../components/common/Toast";
import LessonFormDialog from "../../components/admin/LessonFormDialog";

const ROW_H = 56;

function StatusChip({ value }: { value: LessonStatus }) {
  const dot = <Box component="span" sx={{
    width: 6, height: 6, borderRadius: "50%", mr: 1, display: "inline-block",
    bgcolor: value === "completed" ? "#22c55e" : "#ef4444"
  }} />;
  return value === "completed"
    ? <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Đã hoàn thành</Box>}
      sx={{ bgcolor: "#eaf8f0", color: "#1a7f37", borderColor: "#bfe8cf" }} variant="outlined" />
    : <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Chưa hoàn thành</Box>}
      sx={{ bgcolor: "#fdeeee", color: "#c62828", borderColor: "#f6b9b9" }} variant="outlined" />;
}

type Pending =
  | { type: "none" }
  | { type: "save"; payload: { subject_id: number; lesson_name: string; time: number; status: LessonStatus }; editing?: Lesson | null }
  | { type: "delete"; id: number; name: string };

export default function Lessons() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: subjects } = useSelector((s: RootState) => s.courses);
  const { list: lessons, loading } = useSelector((s: RootState) => s.lessons);

  const [subjectFilter, setSubjectFilter] = useState<number | "all">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<Pending>({ type: "none" });
  const [toast, setToast] = useState<{ open: boolean; msg?: string }>({ open: false });

  const [selected, setSelected] = useState<number[]>([]);

  const rowsPerPage = 8;

  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);
  useEffect(() => {
    if (subjectFilter === "all") dispatch(fetchLessons(undefined));
    else dispatch(fetchLessons(subjectFilter));
  }, [dispatch, subjectFilter]);

  const filtered = useMemo(() => {
    let d = lessons;
    if (q.trim()) d = d.filter(l => l.lesson_name.toLowerCase().includes(q.toLowerCase()));
    return d;
  }, [lessons, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const current = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);


  const isRowChecked = (l: Lesson) => selected.includes(l.id) || l.status === "completed";

  const allChecked = current.length > 0 && current.every(isRowChecked);
  const someChecked = current.some(isRowChecked);

  const toggleAll = () => {
    if (allChecked) {
      // Bỏ chọn tất cả HÀNG CHƯA completed
      setSelected(sel => sel.filter(id => !current.some(r => r.id === id && r.status !== "completed")));
    } else {
      // Chọn tất cả HÀNG CHƯA completed
      setSelected(sel => [
        ...new Set([...sel, ...current.filter(r => r.status !== "completed").map(r => r.id)])
      ]);
    }
  };

  const toggleOne = (l: Lesson) => {
    if (l.status === "completed") return;
    setSelected(sel => sel.includes(l.id) ? sel.filter(x => x !== l.id) : [...sel, l.id]);
  };

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (l: Lesson) => { setEditing(l); setOpenForm(true); };

  const handleSubmitForm = (data: { subject_id: number; lesson_name: string; time: number; status: LessonStatus }) => {
    setPending({ type: "save", payload: data, editing });
    setConfirmOpen(true);
  };

  const askDelete = (l: Lesson) => {
    setPending({ type: "delete", id: l.id, name: l.lesson_name });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (pending.type === "save") {
        if (pending.editing) {
          await dispatch(updateLesson({ id: pending.editing.id, ...pending.payload })).unwrap();
          setToast({ open: true, msg: "Cập nhật bài học thành công" });
        } else {
          await dispatch(addLesson(pending.payload)).unwrap();
          setToast({ open: true, msg: "Thêm bài học thành công" });
        }
        setOpenForm(false);
      } else if (pending.type === "delete") {
        await dispatch(deleteLesson(pending.id)).unwrap();
        setToast({ open: true, msg: `Xóa bài học "${pending.name}" thành công` });
      }
    } catch {
      setToast({ open: true, msg: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setConfirmOpen(false); setPending({ type: "none" });
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <Container maxWidth="100" sx={{ py: 3, bgcolor: "#ffffff" }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MoreHorizIcon sx={{ color: "text.secondary" }} />
            <Typography variant="h5" fontWeight={700}>Bài học</Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Select
              value={subjectFilter}
              onChange={(e) => { setSubjectFilter(e.target.value as any); setPage(1); }}
              size="small"
              sx={{ minWidth: 220, bgcolor: "#ffffff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf2" } }}
            >
              <MenuItem value="all">Lọc theo môn học</MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.subject_name}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }} onClick={openAdd}>
              Thêm mới bài học
            </Button>
          </Stack>
        </Stack>

        {/* Search */}
        <Stack alignItems="end">
          <TextField
            placeholder="Tìm kiếm bài học theo tên..."
            value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
            size="small"
            sx={{ width: 360, bgcolor: "#ffffff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf27a" } }}
            InputProps={{
              endAdornment:
                <InputAdornment position="end"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment>
            }}
          />
        </Stack>

        {/* Table */}
        <Box sx={{ py: 1.5, bgcolor: "#ffffff", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "#f6f8fc", width: 48 }}>
                  <Checkbox
                    size="small"
                    checked={allChecked}
                    indeterminate={!allChecked && someChecked}
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="60%">
                  Tên bài học
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="10%">
                  Thời gian học
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="15%">
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="15%" align="center">
                  Chức năng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current.map((l) => {
                const checked = isRowChecked(l);
                return (
                  <TableRow
                    key={l.id}
                    hover
                    sx={{
                      "& td": { borderBottom: "1px solid #f0f2f7", height: ROW_H, py: 2.5 },
                      "&:last-of-type td": { borderBottom: "none" },
                      bgcolor: checked ? "#f5f5f5" : undefined,          // <-- đổi nền khi được tích
                      transition: "background-color .2s",
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleOne(l)}
                        disabled={l.status === "completed"}           // completed: chỉ hiển thị
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 14 }}>{l.lesson_name}</TableCell>
                    <TableCell>{l.time}</TableCell>
                    <TableCell><StatusChip value={l.status} /></TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: "#ef4444", mr: 0.5 }} onClick={() => askDelete(l)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "#fb923c" }} onClick={() => openEdit(l)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Divider />

          <Stack alignItems="center" sx={{ py: 2.5 }}>
            <Pagination
              color="primary" page={safePage} onChange={(_, p) => setPage(p)}
              count={totalPages < 10 ? totalPages : 10} siblingCount={1} boundaryCount={1}
              showFirstButton showLastButton
              sx={{
                "& .MuiPaginationItem-root": { borderRadius: 1.5, minWidth: 32, height: 32 },
                "& .MuiPaginationItem-root:not(.Mui-selected)": { border: "1px solid #e6ebf2" },
                "& .Mui-selected": { boxShadow: "inset 0 0 0 1px rgba(7, 31, 255, 0.04)" },
              }}
            />
          </Stack>
        </Box>
      </Container>

      {/* Form thêm/sửa */}
      <LessonFormDialog
        open={openForm}
        subjects={subjects as unknown as Course[]}
        initial={editing ?? undefined}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmitForm}
        existing={lessons} 
      />


      {/* Xác nhận */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận"
        description={
          pending.type === "delete"
            ? <>Bạn có chắc chắn muốn xóa bài học: <b>{pending.name}</b> khỏi hệ thống không?</>
            : "Bạn có đồng ý với thao tác này?"
        }
        confirmText={pending.type === "delete" ? "Xóa" : "Lưu"}
        cancelText="Hủy"
        onClose={() => { setConfirmOpen(false); setPending({ type: "none" }); }}
        onConfirm={handleConfirm}
      />

      {/* Toast */}
      <Toast open={toast.open} title="Thành công" message={toast.msg} onClose={() => setToast({ open: false })} />
    </>
  );
}
