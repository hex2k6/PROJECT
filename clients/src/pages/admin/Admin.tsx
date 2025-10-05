import {
  AppBar, Toolbar, Box, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, Stack, IconButton
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Avatar from "@mui/material/Avatar";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";

const SIDEBAR_W = 260;

export default function Admin() {
  const { pathname } = useLocation();
  const isSel = (p: string) => pathname.startsWith(`/admin/${p}`);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "#ffffff" }}>
      {/* Topbar */}
      <AppBar elevation={0} position="sticky" sx={{ bgcolor: "#fff", color: "inherit", borderBottom: "1px solid #edf1f5" }}>
        <Toolbar sx={{ minHeight: 64 }}>
          <Box sx={{ flex: 1 }} />
          <IconButton><NotificationsNoneOutlinedIcon /></IconButton>
          <IconButton><SettingsOutlinedIcon /></IconButton>
          <Avatar sx={{ width: 28, height: 28 }}>L</Avatar>
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
          <Stack direction="row" spacing={1.5} sx={{ px: 2.5, mb: 1.5 }}>
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
    </Box>
  );
}