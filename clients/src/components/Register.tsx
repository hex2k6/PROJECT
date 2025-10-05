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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterFormValues } from "../type/type";
import { Link as RouterLink, useNavigate } from "react-router-dom";


const schema = z
  .object({
    firstName: z.string().trim().min(1, "Vui lòng nhập họ và tên đệm"),
    lastName: z.string().trim().min(1, "Vui lòng nhập tên"),
    email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    agree: z.boolean().default(false),
  })
  .refine((d) => d.agree, { path: ["agree"], message: "Bạn phải đồng ý điều khoản" });

export default function Register() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
    await new Promise((r) => setTimeout(r, 400));
    console.log("Dữ liệu gửi:", data);
    navigate("/login", { replace: true, state: { justSignedUp: true } });
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
        px: { xs: 1.5, sm: 2, md: 6, lg: 10 },
        bgcolor: "#ffffff",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          width: "100%",
          maxWidth: { xs: 420, sm: 480, md: 700 },
          bgcolor: "#ffffff",
        }}
      >
        <Typography align="center" fontWeight={700} sx={{ fontSize: { xs: 20, sm: 22, md: 24 }, mb: 0.5 }}>
          Đăng ký tài khoản
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ fontSize: { xs: 13.5, sm: 14 }, mb: { xs: 2, sm: 3 } }}>
          Đăng ký tài khoản để sử dụng dịch vụ
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} width={341}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Họ và tên đệm</Typography>
            <TextField
              fullWidth
              autoComplete="given-name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register("firstName")}
            />
          </Grid>
          <Grid  item xs={12} sm={6} width={341}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }} fontWeight={600}>Tên</Typography>
            <TextField
              fullWidth
              autoComplete="family-name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register("lastName")}
            />
          </Grid>

          <Grid item xs={12} width={"100%"} >
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

          <Grid item xs={12} width={"100%"} >
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
                      <MuiLink href="#" underline="hover">
                        chính sách và điều khoản
                      </MuiLink>
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

        <Button type="submit" variant="contained" fullWidth disabled={ isValid || isSubmitting} sx={{ mt: { xs: 1.5, sm: 2 } }}>
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
  );
}