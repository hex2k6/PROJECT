import {
  Box, Container, Stack, Typography, Select, MenuItem, Button,
  TextField, InputAdornment, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, IconButton, Pagination, Divider, Snackbar, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addCourse, updateCourse, deleteCourse, type Course, type CourseStatus
} from "../../store/coursesSlice";
import CourseFormDialog from "../../components/admin/CourseFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingScreen from "../../components/common/LoadingScreen";

const ROW_H = 56;

function StatusChip({ value }: { value: CourseStatus }) {
  const dot = <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", mr: 1, display: "inline-block", bgcolor: value === "active" ? "#22c55e" : "#ef4444" }} />;
  return value === "active"
    ? <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Đang hoạt động</Box>} sx={{ bgcolor: "#eaf8f0", color: "#1a7f37", borderColor: "#bfe8cf" }} variant="outlined" />
    : <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Ngừng hoạt động</Box>} sx={{ bgcolor: "#fdeeee", color: "#c62828", borderColor: "#f6b9b9" }} variant="outlined" />;
}

export default function Courses() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((s: RootState) => s.courses);

  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity?: "success" | "error" }>({ open: false, msg: "" });

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [openConfirm, setOpenConfirm] = useState<{ open: boolean; id?: number; message?: string }>({ open: false });

  const rowsPerPage = 8;

  const filtered = useMemo(() => {
    let d = list;
    if (status !== "all") d = d.filter((c) => c.status === status);
    if (q.trim()) d = d.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    return d;
  }, [list, status, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const current = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (course: Course) => { setEditing(course); setOpenForm(true); };
  const askDelete = (id: number) => setOpenConfirm({ open: true, id, message: "Bạn có chắc muốn xóa môn học này?" });

  const handleSubmitForm = async (data: { name: string; status: CourseStatus }) => {
    // Hỏi xác nhận chung
    setOpenConfirm({
      open: true,
      message: "Bạn có đồng ý với thao tác này?",
      id: -1, 
    });

    (handleSubmitForm as any)._payload = data;
  };

  const handleConfirm = async () => {
    // phân biệt add/update vs delete:
    if (openConfirm.id === -1) {
      const payload = (handleSubmitForm as any)._payload as { name: string; status: CourseStatus };
      try {
        if (editing) {
          await dispatch(updateCourse({ id: editing.id, ...payload })).unwrap();
          setSnack({ open: true, msg: "Đã cập nhật môn học", severity: "success" });
        } else {
          await dispatch(addCourse(payload)).unwrap();
          setSnack({ open: true, msg: "Đã thêm môn học", severity: "success" });
        }
      } catch {
        setSnack({ open: true, msg: "Có lỗi xảy ra", severity: "error" });
      } finally {
        setOpenForm(false);
        setOpenConfirm({ open: false });
      }
    } else if (openConfirm.id && openConfirm.id > 0) {
      try {
        await dispatch(deleteCourse(openConfirm.id)).unwrap();
        setSnack({ open: true, msg: "Đã xóa môn học", severity: "success" });
      } catch {
        setSnack({ open: true, msg: "Xóa thất bại", severity: "error" });
      } finally {
        setOpenConfirm({ open: false });
      }
    } else {
      setOpenConfirm({ open: false });
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}

      <Container maxWidth="100" sx={{ py: 3, bgcolor: "#ffffff"}} >
        {/* Header row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MoreHorizIcon sx={{ color: "text.secondary" }} />
            <Typography variant="h5" fontWeight={700}>Môn học</Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Select
              value={status}
              onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
              size="small"
              sx={{ minWidth: 200, bgcolor: "#ffffff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf2" } }}
            >
              <MenuItem value="all">Lọc theo trạng thái</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>

            <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }} onClick={openAdd}>
              Thêm mới môn học
            </Button>
          </Stack>
        </Stack>
        <Stack alignItems={"end"}>
           <TextField
              placeholder="Tìm kiếm môn học theo tên..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              size="small"
              sx={{ width: 360, bgcolor: "#ffffff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf27a" } }}
              InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
            />
        </Stack>

        {/* Table */}
        <Box sx={{ py: 1.5, bgcolor: "#ffffff", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="60%">Tên môn học</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="20%">Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#f6f8fc", color: "text.secondary", py: 1.5 }} width="20%" align="center">Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current.map((c) => (
                <TableRow key={c.id} hover sx={{ "& td": { borderBottom: "1px solid #f0f2f7", height: ROW_H, py: 2.5 }, "&:last-of-type td": { borderBottom: "none" } }}>
                  <TableCell sx={{ fontSize: 14 }}>{c.name}</TableCell>
                  <TableCell><StatusChip value={c.status} /></TableCell>
                  <TableCell align="center">
                    <IconButton size="small" sx={{ color: "#ef4444", mr: 0.5 }} onClick={() => askDelete(c.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#fb923c" }} onClick={() => openEdit(c)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Divider />

          <Stack alignItems="center" sx={{ py: 2.5 }}>
            <Pagination
              color="primary"
              page={safePage}
              onChange={(_, p) => setPage(p)}
              count={totalPages < 10 ? totalPages : 10}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": { borderRadius: 1.5, minWidth: 32, height: 32 },
                "& .MuiPaginationItem-root:not(.Mui-selected)": { border: "1px solid #e6ebf2" },
                "& .Mui-selected": { boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)" },
              }}
            />
          </Stack>
        </Box>
      </Container>

      {/* Popup thêm/sửa */}
      <CourseFormDialog
        open={openForm}
        initial={editing ?? undefined}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmitForm}
      />

      {/* Dialog xác nhận (dùng chung) */}
      <ConfirmDialog
        open={openConfirm.open}
        content={openConfirm.message}
        onClose={() => setOpenConfirm({ open: false })}
        onConfirm={handleConfirm}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={1800}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity ?? "success"} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
