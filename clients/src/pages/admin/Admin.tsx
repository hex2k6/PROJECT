// src/pages/admin/Admin.tsx
import {
  AppBar, Toolbar, Box, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, Stack, IconButton, Menu, MenuItem, Snackbar
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Avatar from "@mui/material/Avatar";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/common/ConfirmDialog"; // 
import React from "react";

const SIDEBAR_W = 260;

type ToastState =
  | { open: false }
  | { open: true; title: string; message: string };

export default function Admin() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSel = (p: string) => pathname.startsWith(`/admin/${p}`);

  // Avatar menu
  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);

  // Confirm & toast
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toast, setToast] = React.useState<ToastState>({ open: false });

  const askLogout = () => {
    closeMenu();
    setConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    // Hiện toast như Home
    setToast({ open: true, title: "Đăng xuất", message: "Bạn đã đăng xuất thành công." });

    // Xóa session demo
    localStorage.removeItem("auth");

    // Điều hướng về /login với cờ loggedOut để Login hiển thị toast nếu bạn muốn
    setTimeout(() => {
      navigate("/login", { replace: true, state: { loggedOut: true } });
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#ffffff" }}>
      {/* Topbar */}
      <AppBar elevation={0} position="sticky" sx={{ bgcolor: "#fff", color: "inherit", borderBottom: "1px solid #edf1f5" }}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Box sx={{ flex: 1 }} />
          <IconButton><NotificationsNoneOutlinedIcon /></IconButton>
          <IconButton><SettingsOutlinedIcon /></IconButton>

          {/* Avatar + Menu */}
          <IconButton onClick={openMenu}>
            <Avatar sx={{ width: 28, height: 28 }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={menuEl}
            open={menuOpen}
            onClose={closeMenu}
            elevation={2}
            PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
          >
            <MenuItem onClick={askLogout} sx={{ color: "#dc2626", gap: 1 }}>
              <LogoutIcon fontSize="small" />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
              bgcolor: "#f7f9fc",
            },
          }}
        >
          <Toolbar />
          <Stack direction="row" spacing={1.5} sx={{  mb: 1.5 }}>
            <Box sx={{ width: 32, borderRadius: 1, bgcolor: "#ffffff", display: "grid", placeItems: "center" }}>
              <SchoolOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography fontWeight={700}>Study Tracker</Typography>
              <Typography variant="caption" color="text.secondary">Quản lý tiến độ học tập</Typography>
            </Box>
          </Stack>

          <Box sx={{ px: 2.5 }}>
            <List sx={{ mt: 1 }}>
              <ListItemButton
                component={RouterLink}
                to="/admin/dashboard"
                selected={isSel("dashboard")}
                sx={{
                  mb: 0.5, borderRadius: 2.5, px: 1.25, py: 1,
                  "& .MuiListItemIcon-root": { minWidth: 36, color: "text.secondary" },
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                  "&.Mui-selected": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "& .MuiListItemText-primary": { color: "primary.main", fontWeight: 700 },
                  },
                }}
              >
                <ListItemIcon><TrendingUpOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Thống kê" />
              </ListItemButton>

              <ListItemButton
                component={RouterLink}
                to="/admin/courses"
                selected={isSel("courses")}
                sx={{
                  mb: 0.5, borderRadius: 2.5, px: 1.25, py: 1,
                  "& .MuiListItemIcon-root": { minWidth: 36, color: "text.secondary" },
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                  "&.Mui-selected": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "& .MuiListItemText-primary": { color: "primary.main", fontWeight: 700 },
                  },
                }}
              >
                <ListItemIcon><LibraryBooksOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Quản lý môn học" />
              </ListItemButton>

              <ListItemButton
                component={RouterLink}
                to="/admin/lessons"
                selected={isSel("lessons")}
                sx={{
                  mb: 0.5, borderRadius: 2.5, px: 1.25, py: 1,
                  "& .MuiListItemIcon-root": { minWidth: 36, color: "text.secondary" },
                  "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                  "&.Mui-selected": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                    "&:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.16) },
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "& .MuiListItemText-primary": { color: "primary.main", fontWeight: 700 },
                  },
                }}
              >
                <ListItemIcon><MenuBookOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Quản lý bài học" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Dialog xác nhận đăng xuất */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Toast góc phải */}
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={toast.open ? 1400 : undefined}
        sx={{ "& .MuiSnackbarContent-root": { bgcolor: "transparent", boxShadow: "none", p: 0 } }}
      >
        <Box
          sx={{
            bgcolor: "#2f3a55",
            color: "#fff",
            px: 2.5,
            py: 1.75,
            borderRadius: 2,
            minWidth: 340,
            boxShadow: 3,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <CheckCircleIcon sx={{ color: "#22c55e", mt: "2px" }} />
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700}>{toast.open ? toast.title : ""}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {toast.open ? toast.message : ""}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setToast({ open: false })}
            size="small"
            sx={{ color: "rgba(255,255,255,.7)", "&:hover": { color: "#fff" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
}
