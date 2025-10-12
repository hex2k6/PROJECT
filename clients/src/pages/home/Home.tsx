// src/components/Home.tsx
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
  Stack,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Search from "@mui/icons-material/Search";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Close from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CourseCard from "./CourseCard";
import Footer from "./Footer";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { http, SUBJECTS_URL, LESSONS_URL } from "../../lib/api";

// ---- API types (theo db.json) ----
type APISubject = {
  id: number;
  subject_name: string;
  status: "active" | "inactive";
  created_at: string;
};

type APILesson = {
  id: number;
  subject_id: number;
  lesson_name: string;
  time: number;
  status: "completed" | "incomplete";
  created_at: string;
};

// ---- UI type khớp với CourseCard hiện tại ----
type UICourse = {
  id: number;
  title: string;
  lessons: { name: string; done: boolean }[];
};

type ToastState =
  | { open: false }
  | { open: true; kind: "success" | "error"; title: string; message: string };

export default function Home() {
  const [tab, setTab] = useState<0 | 1 | 2>(0);
  const [q, setQ] = useState("");

  // Avatar menu
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuEl);

  // Confirm + toast
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ open: false });

  // DATA
  const [courses, setCourses] = useState<UICourse[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch subjects + lessons rồi ghép về dạng UICourse cho CourseCard
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [subjects, lessons] = await Promise.all([
          http<APISubject[]>(SUBJECTS_URL),
          http<APILesson[]>(LESSONS_URL),
        ]);

        const ui: UICourse[] = subjects.map((s) => {
          const ls = lessons
            .filter((l) => l.subject_id === s.id)
            .map((l) => ({ name: l.lesson_name, done: l.status === "completed" }));
          return { id: s.id, title: s.subject_name, lessons: ls };
        });

        setCourses(ui);
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          kind: "error",
          title: "Không tải được dữ liệu",
          message: "Vui lòng thử lại sau ít phút.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const base = courses.filter((c) =>
      c.title.toLowerCase().includes(q.trim().toLowerCase())
    );
    if (tab === 1) return base.filter((c) => c.lessons.some((l) => l.done));
    if (tab === 2)
      return base.filter((c) => c.lessons.length > 0 && !c.lessons.some((l) => l.done));
    return base;
  }, [tab, q, courses]);

  // Menu handlers
  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setMenuEl(e.currentTarget);
  };
  const handleMenuClose = () => setMenuEl(null);

  // Click "Đăng xuất" -> hỏi xác nhận
  const handleAskLogout = () => {
    handleMenuClose();
    setConfirmOpen(true);
  };

  // Xác nhận đăng xuất
  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    try {
      localStorage.removeItem("auth");
      setToast({
        open: true,
        kind: "success",
        title: "Thành công",
        message: "Đăng xuất thành công",
      });
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch {
      setToast({
        open: true,
        kind: "error",
        title: "Lỗi",
        message: "Không thể đăng xuất. Vui lòng thử lại.",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100dvh" }}>
      <AppBar elevation={0} position="sticky" sx={{ bgcolor: "#ffffff" }}>
        <Container maxWidth="lg" sx={{ pt: 3, bgcolor: "#ffffff" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{
                flex: 30,
                height: 65,
                bgcolor: "#f5f5f5ec",
                borderRadius: 1,
                justifyContent: "center",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ flex: 1 }} />
            <Tabs value={0} sx={{ ".MuiTabs-indicator": { display: "none" } }}>
              <Tab label="Trang chủ" />
              <Tab label="Môn học" />
              <Tab label="Bài học" />
            </Tabs>

            <Tooltip title="Yêu thích">
              <IconButton>
                <FavoriteBorder />
              </IconButton>
            </Tooltip>

            {/* Avatar + menu */}
            <Tooltip title="Tài khoản">
              <Avatar
                sx={{ width: 28, height: 28, cursor: "pointer" }}
                onClick={handleAvatarClick}
              >
                <PersonOutline fontSize="small" />
              </Avatar>
            </Tooltip>
            <Menu
              anchorEl={menuEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleAskLogout}>
                <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Container>
        <Divider sx={{ my: 3, borderColor: "#dadada" }} />
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 7, bgcolor: "#ffffff" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 2, ".MuiTabs-indicator": { height: 3, borderRadius: 2 } }}
        >
          <Tab label="Tất cả môn học" />
          <Tab label="Đã hoàn thành" />
          <Tab label="Chưa hoàn thành" />
        </Tabs>

        {/* grid cards */}
        {loading ? (
          <Typography color="text.secondary">Đang tải dữ liệu…</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            }}
          >
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c as any} />
            ))}
          </Box>
        )}
      </Container>

      <Footer />

      {/* Xác nhận đăng xuất */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
        confirmText="Đăng xuất"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Toast góc phải */}
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={toast.open ? 1800 : undefined}
        sx={{ "& .MuiSnackbarContent-root": { bgcolor: "transparent", boxShadow: "none", p: 0 } }}
      >
        <Box
          sx={{
            bgcolor: toast.open && toast.kind === "error" ? "#7a2b2b" : "#2f3a55",
            color: "#fff",
            px: 2.5,
            py: 1.75,
            borderRadius: 2,
            minWidth: 340,
            boxShadow: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              {toast.open && toast.kind === "error" ? (
                <ErrorOutline sx={{ color: "#ffb4b4", mt: "2px" }} />
              ) : (
                <CheckCircle sx={{ color: "#22c55e", mt: "2px" }} />
              )}
              <Box>
                <Typography fontWeight={700}>{toast.open ? toast.title : ""}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {toast.open ? toast.message : ""}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={() => setToast({ open: false })}
              size="small"
              sx={{ color: "rgba(255,255,255,.7)", "&:hover": { color: "#fff" } }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Snackbar>
    </Box>
  );
}
