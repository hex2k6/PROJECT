// src/pages/admin/Courses.tsx
import {
  Box, Container, Stack, Typography, Select, MenuItem, Button,
  TextField, InputAdornment, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, IconButton, Pagination, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useMemo, useState } from "react";

type Course = { id: number; name: string; status: "active" | "inactive" };
const ALL: Course[] = [
  { id: 1, name: "Lập trình C", status: "active" },
  { id: 2, name: "Lập trình Frontend với ReactJS", status: "inactive" },
  { id: 3, name: "Lập trình Backend với Spring boot", status: "active" },
  { id: 4, name: "Lập trình Frontend với Vue.JS", status: "inactive" },
  { id: 5, name: "Cấu trúc dữ liệu và giải thuật", status: "inactive" },
  { id: 6, name: "Phân tích và thiết kế hệ thống", status: "inactive" },
  { id: 7, name: "Toán cao cấp", status: "active" },
  { id: 8, name: "Tiếng Anh chuyên ngành", status: "inactive" },
  { id: 9, name: "Python cơ bản", status: "active" },
  { id: 10, name: "NodeJS nâng cao", status: "inactive" },
  { id: 11, name: "Kỹ năng mềm", status: "active" },
];

const ROW_H = 56;
function StatusChip({ value }: { value: Course["status"] }) {
  const dot = <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", mr: 1, display: "inline-block", bgcolor: value === "active" ? "#22c55e" : "#ef4444" }} />;
  return value === "active"
    ? <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Đang hoạt động</Box>} sx={{ bgcolor: "#eaf8f0", color: "#1a7f37", borderColor: "#bfe8cf" }} variant="outlined" />
    : <Chip size="small" label={<Box sx={{ display: "inline-flex", alignItems: "center" }}>{dot}Ngừng hoạt động</Box>} sx={{ bgcolor: "#fdeeee", color: "#c62828", borderColor: "#f6b9b9" }} variant="outlined" />;
}

export default function Courses() {
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const data = useMemo(() => {
    let d = ALL;
    if (status !== "all") d = d.filter((c) => c.status === status);
    if (q.trim()) d = d.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    return d;
  }, [status, q]);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const current = data.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
            sx={{ minWidth: 200, bgcolor: "#fff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf2" } }}
          >
            <MenuItem value="all">Lọc theo trạng thái</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>

          <Button variant="contained" startIcon={<AddIcon />} sx={{ height: 40 }}>
            Thêm mới môn học
          </Button>

          <TextField
            placeholder="Tìm kiếm môn học theo tên..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            size="small"
            sx={{ width: 360, bgcolor: "#ffffff", ".MuiOutlinedInput-notchedOutline": { borderColor: "#e6ebf2" } }}
            InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }}
          />
        </Stack>
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
                  <IconButton size="small" sx={{ color: "#ef4444", mr: 0.5 }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: "#fb923c" }}>
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
  );
}
