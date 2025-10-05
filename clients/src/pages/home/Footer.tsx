// src/pages/home/components/Footer.tsx
import { Box, Container, Divider, Stack, Typography } from "@mui/material";

function FooterItem({ text }: { text: string }) {
    return <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.75 }}>{text}</Typography>;
}

export default function Footer() {
    return (
        // Thẻ Box ngoài có nền đen và full width
        <Box component="footer" sx={{ bgcolor: "#0f1114", color: "#bfc5d1", width: "100%" }}>
            <Container maxWidth="lg"  sx={{ bgcolor: "#0f1114", color: "#bfc5d1", py: 5, width: "100%" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="space-between">
                    <Box sx={{ maxWidth: 380 }}>
                        <Typography fontWeight={700} color="#fff" sx={{ mb: 1 }}>
                            Chúng tôi cung cấp giải pháp học tập
                        </Typography>
                        <Typography variant="body2">Giúp học sinh và sinh viên học tập hiệu quả hơn.</Typography>
                    </Box>

                    <Stack direction="row" spacing={6} >
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
                </Stack>

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

                <Typography variant="caption" color="#9aa3b2">
                    © 2025 Your Academy — All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
}
