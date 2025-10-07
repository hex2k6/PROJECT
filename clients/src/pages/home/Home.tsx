import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    Divider,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Search from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import { COURSES } from "./data/courses";
import CourseCard from "./CourseCard";
import Footer from "./Footer";

export default function Home() {
    const [tab, setTab] = useState<0 | 1 | 2>(0);
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const base = COURSES.filter((c) =>
            c.title.toLowerCase().includes(q.trim().toLowerCase())
        );
        if (tab === 1) return base.filter((c) => c.lessons.some((l) => l.done));
        if (tab === 2) return base.filter((c) => c.lessons.length > 0 && !c.lessons.some((l) => l.done));
        return base;
    }, [tab, q]);

    return (
        <Box sx={{ bgcolor: "#ffffff", minHeight: "100dvh" }}>
            <AppBar elevation={0} position="sticky" sx={{ bgcolor: "#ffffff" }}>
                <Container maxWidth="lg" sx={{ paddingTop: 3, bgcolor: "#ffffff" }}>
                    <Box display="flex" alignItems="center" gap={1} >
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Tìm kiếm"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            sx={{
                                flex: 30, height: 65, bgcolor: "#f5f5f5ec", borderRadius: 1, justifyContent : "center",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { border: "none" },              
                                    "&:hover fieldset": { border: "none" },        
                                    "&.Mui-focused fieldset": { border: "none" },  
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />


                        <Box sx={{ flex: 1 }} />
                        <Tabs value={0} sx={{ ".MuiTabs-indicator": { display: "none" } }}>
                            <Tab label="Trang chủ" />
                            <Tab label="Môn học" />
                            <Tab label="Bài học" />
                        </Tabs>

                        <Tooltip title="Yêu thích">
                            <IconButton>
                                <FavoriteBorder />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Tài khoản">
                            <Avatar sx={{ width: 28, height: 28 }}>
                                <PersonOutline fontSize="small" />
                            </Avatar>
                        </Tooltip>
                    </Box>
                </Container>
                <Divider sx={{ my: 3, borderColor: "#dadada" }} />
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 7, bgcolor: "#ffffff" }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2, ".MuiTabs-indicator": { height: 3, borderRadius: 2 } }}
                >
                    <Tab label="Tất cả môn học" />
                    <Tab label="Đã hoàn thành" />
                    <Tab label="Chưa hoàn thành" />
                </Tabs>

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    }}
                >
                    {filtered.map((c) => (
                        <CourseCard key={c.id} course={c} />
                    ))}
                </Box>
            </Container>

            <Footer />

        </Box>
    );
}