import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Search from "@mui/icons-material/Search";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";
import { useMemo, useState } from "react";

type Lesson = { name: string; done?: boolean };
type Course = {
  id: number;
  title: string;
  lessons: Lesson[];
  doneCount?: number;
};

const COURSES: Course[] = [
  {
    id: 1,
    title: "HTML cơ bản",
    lessons: [
      { name: "Session 01: Tổng quan về HTML", done: true },
      { name: "Session 02: Thẻ inline và block", done: true },
      { name: "Session 03: Thẻ hình ảnh", done: false },
      { name: "Session 04: Thẻ chuyển trang", done: false },
      { name: "Session 05: Thẻ Semantic", done: false },
    ],
  },
  {
    id: 2,
    title: "CSS cơ bản",
    lessons: [
      { name: "Session 01: Tổng quan về CSS", done: true },
      { name: "Session 02: Đưa CSS vào trang Web", done: true },
      { name: "Session 03: Position", done: false },
      { name: "Session 04: Flexbox", done: false },
      { name: "Session 05: Animation", done: false },
    ],
  },
  {
    id: 3,
    title: "JavaScript cơ bản",
    lessons: [
      { name: "Session 01: Tổng quan ngôn ngữ JavaScript", done: false },
      { name: "Session 02: Khai báo biến", done: false },
      { name: "Session 03: Câu lệnh điều kiện", done: false },
      { name: "Session 04: Vòng lặp", done: false },
      { name: "Session 05: Mảng", done: false },
    ],
  },
  {
    id: 4,
    title: "Lập trình với React.js",
    lessons: [
      { name: "Session 01: Tổng quan về React.js", done: false },
      { name: "Session 02: Props, State, Event", done: false },
      { name: "Session 03: React Hook", done: false },
      { name: "Session 04: UI Framework", done: false },
      { name: "Session 05: React Router", done: false },
    ],
  },
  {
    id: 5,
    title: "Lập trình với Java",
    lessons: [
      { name: "Session 01: Tổng quan về ngôn ngữ Java", done: false },
      { name: "Session 02: Khai báo biến", done: false },
      { name: "Session 03: Cấu lệnh điều kiện", done: false },
      { name: "Session 04: Vòng lặp", done: false },
      { name: "Session 05: Mảng", done: false },
    ],
  },
  {
    id: 6,
    title: "Lập trình C",
    lessons: [],
  },
];
function CourseCard({ course }: { course: Course }) {
  const finished = course.lessons.filter((l) => l.done).length;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 2,
        "&:hover": { boxShadow: 1, borderColor: "primary.100" },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          {course.title}
        </Typography>

        {course.lessons.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            Chưa có bài học nào
          </Box>
        ) : (
          <Stack spacing={1}>
            {course.lessons.slice(0, 5).map((l, idx) => (
              <Stack
                direction="row"
                spacing={1}
                key={idx}
                sx={{ color: l.done ? "success.main" : "text.secondary" }}
              >
                {l.done ? (
                  <CheckCircleOutline fontSize="small" />
                ) : (
                  <RadioButtonUnchecked fontSize="small" />
                )}
                <Typography variant="body2" noWrap title={l.name}>
                  {l.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {course.lessons.length > 0 && (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.25 }}>
            <Chip
              size="small"
              color={finished ? "success" : "default"}
              label={
                finished ? `${finished}/${course.lessons.length} đã hoàn thành` : "Mới bắt đầu"
              }
              variant={finished ? "outlined" : "outlined"}
            />
            <Button size="small" endIcon={<ArrowRightAlt />} sx={{ textTransform: "none" }}>
              Xem thêm
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [tab, setTab] = useState<0 | 1 | 2>(0);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const base = COURSES.filter((c) =>
      c.title.toLowerCase().includes(q.trim().toLowerCase())
    );
    if (tab === 1) {
      return base.filter((c) => c.lessons.some((l) => l.done));
    }
    if (tab === 2) {
      return base.filter((c) => c.lessons.length > 0 && !c.lessons.some((l) => l.done));
    }
    return base;
  }, [tab, q]);

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100dvh" }}>
      {/* header */}
      <AppBar
        elevation={0}
        position="sticky"
        sx={{ bgcolor: "#ffffff" }}
      >
        <Container maxWidth="lg" sx={{ py: 1.25 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              size="small"
              placeholder="Tìm kiếm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Tabs value={0} sx={{ ".MuiTabs-indicator": { display: "none" } }}>
              <Tab  label="Trang chủ" />
              <Tab  label="Môn học" />
              <Tab label="Bài học" />
            </Tabs>

            <Box sx={{ flex: 1 }} />
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
          </Stack>
        </Container>
      </AppBar>
      {/* content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2,
            ".MuiTabs-indicator": { height: 3, borderRadius: 2 },
          }}
        >
          <Tab label="Tất cả môn học" />
          <Tab label="Đã hoàn thành" />
          <Tab label="Chưa hoàn thành" />
        </Tabs>

        {/* grid cards */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
          }}
        >
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </Box>
      </Container>

      {/* footer */}
      <Box sx={{ bgcolor: "#0f1114", color: "#bfc5d1", mt: 6, py: 5 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="space-between"
          >
            <Box sx={{ maxWidth: 380 }}>
              <Typography fontWeight={700} color="#fff" sx={{ mb: 1 }}>
                Chúng tôi cung cấp giải pháp học tập
              </Typography>
              <Typography variant="body2">
                Giúp học sinh và sinh viên học tập hiệu quả hơn.
              </Typography>
            </Box>

            <Stack direction="row" spacing={6}>
              <Box>
                <Typography color="#fff" fontWeight={700} sx={{ mb: 1 }}>
                  Danh mục
                </Typography>
                <FooterItem text="Môn học" />
                <FooterItem text="Bài học" />
                <FooterItem text="Ghi chú" />
              </Box>
              <Box>
                <Typography color="#fff" fontWeight={700} sx={{ mb: 1 }}>
                  Hỗ trợ khách hàng
                </Typography>
                <FooterItem text="Tìm kiếm dịch vụ" />
                <FooterItem text="Điều khoản sử dụng" />
                <FooterItem text="Chính sách và điều khoản" />
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography variant="caption" color="#9aa3b2">
            © 2025 Your Academy — All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function FooterItem({ text }: { text: string }) {
  return (
    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.75 }}>
      {text}
    </Typography>
  );
}
