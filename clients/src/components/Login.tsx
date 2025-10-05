import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormValues } from "../type/type";
import { useLocation, Link as RouterLink } from "react-router-dom";

// --- schema ---
const schema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  remember: z.boolean().default(false),
});

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation() as any;
  const justSignedUp = location.state?.justSignedUp;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // TODO: gọi API thật (fetch/axios)
    await new Promise((r) => setTimeout(r, 400));
    console.log("Đăng nhập:", data);
    alert("Đăng nhập thành công!");
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#ffffff",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          width: "100%",
          maxWidth: { xs: 420, sm: 480, md: 560 },
          bgcolor: "#ffffff",
        }}
      >
        <Typography fontWeight={800} sx={{ fontSize: { xs: 22, sm: 26 }, mb: 0.5 }}>
          Đăng nhập
        </Typography>
        <Typography  color="text.secondary" sx={{ fontSize: { xs: 13.5, sm: 14 }, mb: { xs: 2, sm: 3 } }}>
          Đăng nhập tài khoản để sử dụng hệ thống quản lý.
        </Typography>

        {justSignedUp && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Tạo tài khoản thành công. Vui lòng đăng nhập.
          </Alert>
        )}

        <Grid container spacing={5}>
          <Grid item xs={12} width={"100%"}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Email</Typography>
            <TextField
              type="email"
              fullWidth
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
          </Grid>

          <Grid item xs={12} width={"100%"}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Mật khẩu</Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: { xs: 1, sm: 2 } }}>
          <Grid item>
            <FormControlLabel
              control={<Checkbox {...register("remember")} size={isMobile ? "small" : "medium"} />}
              label={<Typography sx={{ fontSize: { xs: 13.5, sm: 14 } }}>Nhớ tài khoản</Typography>}
            />
          </Grid>
          <Grid item>
            <MuiLink href="#" underline="hover" sx={{ fontSize: { xs: 13.5, sm: 14 } }}>
              Quên mật khẩu?
            </MuiLink>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" fullWidth disabled={isValid || isSubmitting} sx={{ mt: { xs: 1.5, sm: 2 } }}>
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        <Typography align="center" sx={{ mt: { xs: 1.5, sm: 2 } }}>
          Bạn chưa có tài khoản?{" "}
          <MuiLink component={RouterLink} to="/register" underline="hover">
            Đăng ký
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
}
