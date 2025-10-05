import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme";

// Public
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Admin
import Admin from "./pages/admin/Admin";
import Courses from "./pages/admin/Courses";
import Dashboard from "./pages/admin/Dashboard";
import Lessons from "./pages/admin/Lessons";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<Courses />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
