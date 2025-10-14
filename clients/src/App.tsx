import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme";

// Public
import Homes from "./pages/home/Home";
import Login from "./components/Login";
import Register from "./components/Register";

// Admin
import Admin from "./pages/admin/Admin";
import Courses from "./pages/admin/Courses";
import Dashboard from "./pages/admin/Dashboard";
import Lessons from "./pages/admin/Lessons";

import { RequireAuth, RequireAdmin } from "./components/guards/PrivateRoute";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/" element={<Navigate to="/homes" replace />} />
          <Route path="/homes" element={<RequireAuth />}>
            <Route index element={<Homes/>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* admin */}
          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<Admin />}>
              <Route index element={<Navigate to="courses" replace />} />
              <Route path="courses" element={<Courses />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="lessons" element={<Lessons />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/homes" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
