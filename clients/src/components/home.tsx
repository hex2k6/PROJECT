import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Pagination,
  Divider,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Avatar from "@mui/material/Avatar";
import { useMemo, useState } from "react";

type Course = {
  id: number;
  name: string;
  status: "active" | "inactive";
};

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

const SIDEBAR_W = 240;

function StatusChip({ value }: { value: Course["status"] }) {
  return value === "active" ? (
    <Chip label="Đang hoạt động" size="small" sx={{ bgcolor: "#e6f7e9", color: "#1a7f37" }} />
  ) : (
    <Chip label="Ngừng hoạt động" size="small" sx={{ bgcolor: "#fde8e8", color: "#c62828" }} />
  );
}

export default function CoursesAdmin() {
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(3); // để nhìn giống mockup (đang ở trang 3)
  const rowsPerPage = 8;

  const data = useMemo(() => {
    let d = ALL;
    if (status !== "all") d = d.filter((c) => c.status === status);
    if (q.trim()) d = d.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    return d;
  }, [status, q]);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const current = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#f5f7fb" }}>
      {/* Topbar */}
      <AppBar elevation={0} position="sticky" sx={{ bgcolor: "#fff", color: "inherit", borderBottom: "1px solid #edf1f5" }}>
        <Toolbar sx={{ gap: 1, minHeight: 64 }}>
          <Typography fontWeight={700}>Study Tracker</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton><NotificationsNoneOutlinedIcon /></IconButton>
          <IconButton><SettingsOutlinedIcon /></IconButton>
          <Avatar sx={{ width: 28, height: 28 }}>L</Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar + Content */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_W,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: SIDEBAR_W,
              boxSizing: "border-box",
              borderRight: "1px solid #edf1f5",
              bgcolor: "#f7f9fc",
            },
          }}
          open
        >
          <Toolbar />
          <List sx={{ px: 1, py: 1 }}>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon><DashboardOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Thống kê" secondary="Quản lý tiến độ học tập" />
            </ListItemButton>
            <ListItemButton selected sx={{ borderRadius: 2, mt: 0.5 }}>
              <ListItemIcon><LibraryBooksOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Quản lý môn học" />
            </ListItemButton>
            <ListItemButton sx={{ borderRadius: 2, mt: 0.5 }}>
              <ListItemIcon><MenuBookOutlinedIcon /></ListItemIcon>
              <ListItemText primary="Quản lý bài học" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header row */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <MoreHorizIcon sx={{ color: "text.secondary" }} />
                <Typography variant="h5" fontWeight={700}>Môn học</Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
                  size="small"
                  sx={{ minWidth: 180, bgcolor: "#fff" }}
                >
                  <MenuItem value="all">Lọc theo trạng thái</MenuItem>
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
                </Select>
                <Button variant="contained" startIcon={<AddIcon />}>Thêm mới môn học</Button>
              </Stack>
            </Stack>

            {/* Search */}
            <TextField
              placeholder="Tìm kiếm môn học theo tên..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              size="small"
              fullWidth
              sx={{ mb: 2, bgcolor: "#fff" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Table */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #edf1f5", borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "#f9fbfd" } }}>
                    <TableCell width="60%">Tên môn học</TableCell>
                    <TableCell width="20%">Trạng thái</TableCell>
                    <TableCell width="20%" align="center">Chức năng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {current.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>{c.name}</TableCell>
                      <TableCell><StatusChip value={c.status} /></TableCell>
                      <TableCell align="center">
                        <IconButton color="error" size="small" sx={{ mr: 0.5 }}><DeleteOutlineIcon /></IconButton>
                        <IconButton color="warning" size="small"><EditOutlinedIcon /></IconButton>
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
              <Stack alignItems="center" sx={{ py: 1.5 }}>
                <Pagination
                  color="primary"
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  count={totalPages < 7 ? totalPages : 20}
                  siblingCount={1}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
