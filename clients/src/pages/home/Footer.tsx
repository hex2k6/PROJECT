// src/pages/home/components/Footer.tsx
import { Box, Container, Stack, Typography } from "@mui/material";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';

function FooterItem({ text }: { text: string }) {
    return <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.75 }}>{text}</Typography>;
}

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: "#0f1114", color: "#bfc5d1", width: "100%" }}>
            <Container maxWidth="lg" sx={{ bgcolor: "#0f1114", color: "#bfc5d1", py: 15, width: "100%" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="space-between">
                    <Box sx={{ maxWidth: 380 }}>
                        <Typography fontWeight={700} color="#fff" sx={{ mb: 1 }}>
                            Chúng tôi cung cấp giải pháp học tập
                        </Typography>
                        <Typography variant="body2">Giúp học sinh và sinh viên học tập hiệu quả hơn.</Typography>
                    </Box>


                    <Box>
                        <Typography color="#fff" fontWeight={700} sx={{ mb: 1 }}>Danh mục</Typography>
                        <FooterItem text="Môn học" />
                        <FooterItem text="Bài học" />
                        <FooterItem text="Ghi chú" />
                    </Box>
                    <Box>
                        <Typography color="#fff" fontWeight={700} sx={{ mb: 1 }}>Hỗ trợ khách hàng</Typography>
                        <FooterItem text="Tìm kiếm dịch vụ" />
                        <FooterItem text="Điều khoản sử dụng" />
                        <FooterItem text="Chính sách và điều khoản" />
                    </Box>
                </Stack>

          

                <Typography variant="caption" color="#9aa3b2">
                    <Stack display={"flex"} direction="row" py={4} spacing={3}>
                        <PhotoCameraOutlinedIcon />
                        <FacebookIcon />
                        <FingerprintIcon />
                        <FilterCenterFocusIcon />
                    </Stack>
                </Typography>
            </Container>
        </Box>
    );
}
