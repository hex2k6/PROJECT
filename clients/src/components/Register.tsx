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
  Snackbar,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, Close, ErrorOutline } from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterFormValues, User } from "../type/type";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { http, USERS_URL } from "../lib/api";

const schema = z
  .object({
    firstName: z.string().trim().min(1, "Vui lòng nhập họ và tên đệm"),
    lastName: z.string().trim().min(1, "Vui lòng nhập tên"),
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    agree: z.boolean().default(false),
  })
  .refine((d) => d.agree, { path: ["agree"], message: "Bạn phải đồng ý điều khoản" });

type ToastState =
  | { open: false }
  | { open: true; kind: "success" | "error"; title: string; message: string };

export default function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>({ open: false });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "", email: "", password: "", agree: false },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // 1) Kiểm tra trùng email (dùng http helper)
      const existed = await http<User[]>(
        `${USERS_URL}?email=${encodeURIComponent(data.email.trim().toLowerCase())}`
      );
      if (existed.length > 0) {
        setToast({
          open: true,
          kind: "error",
          title: "Email đã tồn tại",
          message: "Vui lòng dùng email khác để đăng ký.",
        });
        return;
      }

      // 2) Tạo user
      const newUser: User = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      await http<User>(USERS_URL, {
        method: "POST",
        body: JSON.stringify(newUser),
      });

      setToast({
        open: true,
        kind: "success",
        title: "Thành công",
        message: "Đăng ký tài khoản thành công",
      });
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { justSignedUp: true, emailPrefill: newUser.email },
        });
      }, 2000);
    } catch (e) {
      console.error(e);
      setToast({
        open: true,
        kind: "error",
        title: "Lỗi hệ thống",
        message: "Không thể tạo tài khoản. Vui lòng thử lại.",
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
          px: { xs: 1.5, sm: 2, md: 6, lg: 10 },
          bgcolor: "#ffffff",
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%", maxWidth: { xs: 420, sm: 480, md: 700 } }}>
          <Typography align="center" fontWeight={700} sx={{ fontSize: { xs: 20, sm: 22, md: 24 }, mb: 0.5 }}>
            Đăng ký tài khoản
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ fontSize: { xs: 13.5, sm: 14 }, mb: { xs: 2, sm: 3 } }}>
            Đăng ký tài khoản để sử dụng dịch vụ
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} width={340}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Họ và tên đệm</Typography>
              <TextField fullWidth autoComplete="given-name" error={!!errors.firstName} helperText={errors.firstName?.message} {...register("firstName")} />
            </Grid>
            <Grid item xs={12} sm={6} width={340}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Tên</Typography>
              <TextField fullWidth autoComplete="family-name" error={!!errors.lastName} helperText={errors.lastName?.message} {...register("lastName")} />
            </Grid>

            <Grid item xs={12} width={"100%"}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Email</Typography>
              <TextField type="email" fullWidth autoComplete="email" error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
            </Grid>

            <Grid item xs={12} width={"100%"}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Mật khẩu</Typography>
              <TextField
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
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

          <Box sx={{ mt: { xs: 1, sm: 2 } }}>
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={<Checkbox {...field} checked={!!field.value} size={isMobile ? "small" : "medium"} />}
                    label={
                      <Typography sx={{ fontSize: { xs: 13.5, sm: 14 } }}>
                        Bạn đồng ý với{" "}
                        <MuiLink href="#" underline="hover">chính sách và điều khoản</MuiLink>
                      </Typography>
                    }
                  />
                  {errors.agree && (
                    <Typography color="error" fontSize="0.8rem" sx={{ ml: 4 }}>
                      {errors.agree.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>

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
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <Typography align="center" sx={{ mt: { xs: 1.5, sm: 2 } }}>
            Bạn đã có tài khoản?{" "}
            <MuiLink component={RouterLink} to="/login" underline="hover">
              Đăng nhập
            </MuiLink>
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={toast.open ? 2000 : undefined}
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
