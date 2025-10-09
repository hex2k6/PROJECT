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
  Snackbar,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, Close, ErrorOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormValues, User } from "../type/type";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { USERS_URL, http } from "../lib/api";

const schema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  remember: z.boolean().default(false),
});

type ToastState =
  | { open: false }
  | { open: true; kind: "success" | "error"; title: string; message: string };

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>({ open: false });
  const navigate = useNavigate();

  const location = useLocation() as any;
  const justSignedUp = location.state?.justSignedUp === true;
  const emailPrefill = location.state?.emailPrefill as string | undefined;

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    if (emailPrefill) setValue("email", emailPrefill);
    else {
      const saved = localStorage.getItem("rememberEmail");
      if (saved) setValue("email", saved);
    }
  }, [emailPrefill, setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const users = await http<User[]>(
        `${USERS_URL}?email=${encodeURIComponent(data.email.trim().toLowerCase())}`
      );

      if (users.length === 0) {
        setToast({
          open: true,
          kind: "error",
          title: "Email không tồn tại",
          message: "Vui lòng kiểm tra lại địa chỉ email.",
        });
        return;
      }

      const user = users[0];
      if (user.password !== data.password) {
        setToast({
          open: true,
          kind: "error",
          title: "Mật khẩu không đúng",
          message: "Vui lòng nhập lại mật khẩu.",
        });
        return;
      }

      // giả lập lưu session
      localStorage.setItem(
        "auth",
        JSON.stringify({
          userId: user.id,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
        })
      );
      if (data.remember) localStorage.setItem("rememberEmail", user.email);
      else localStorage.removeItem("rememberEmail");

      // toast thành công + điều hướng
      setToast({
        open: true,
        kind: "success",
        title: "Thành công",
        message: "Đăng nhập thành công",
      });
      setTimeout(() => navigate("/homes", { replace: true }), 1500);
    } catch (e) {
      console.error(e);
      setToast({
        open: true,
        kind: "error",
        title: "Lỗi hệ thống",
        message: "Không thể đăng nhập. Vui lòng thử lại.",
      });
    }
  };

  return (
    <>
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
          sx={{ width: "100%", maxWidth: { xs: 420, sm: 480, md: 560 } }}
        >
          <Typography fontWeight={800} sx={{ fontSize: { xs: 22, sm: 26 }, mb: 0.5 }}>
            Đăng nhập
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 13.5, sm: 14 }, mb: { xs: 2, sm: 3 } }}>
            Đăng nhập tài khoản để sử dụng hệ thống quản lý.
          </Typography>

          {justSignedUp && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Tạo tài khoản thành công. Vui lòng đăng nhập.
            </Alert>
          )}

          <Grid container spacing={5} >
            <Grid item xs={12} container spacing={1.5} width={"100%"}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>
                Email
              </Typography>
              <TextField
                type="email" fullWidth autoComplete="email"
                error={!!errors.email} helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>

            <Grid item xs={12} container spacing={1.5} width={"100%"}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>
                Mật khẩu
              </Typography>
              <TextField
                type={showPassword ? "text" : "password"} fullWidth autoComplete="current-password"
                error={!!errors.password} helperText={errors.password?.message}
                {...register("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isValid || isSubmitting}
            sx={{
              mt: { xs: 1.5, sm: 2 },
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              "&.Mui-disabled": { bgcolor: "#2563eb", color: "#fff", opacity: 0.55 },
            }}
          >
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
            <IconButton onClick={() => setToast({ open: false })} size="small" sx={{ color: "rgba(255,255,255,.7)", "&:hover": { color: "#fff" } }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Snackbar>
    </>
  );
}
