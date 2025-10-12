import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";


import type { Course } from "../home/data/courses";

export default function CourseCard({ course }: { course: Course }) {
    const finished = course.lessons.filter((l) => l.done).length;

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 2,
                "&:hover": { boxShadow: 1, borderColor: "primary.100" },
                bgcolor: "#ffffff",
            }}
        >
            <CardContent sx={{ p: 2.25, bgcolor:"#ffffff" }} >
                <Typography fontWeight={700} sx={{ mb: 1 }} paddingBottom={2}>
                    {course.title}
                </Typography>

                {course.lessons.length === 0 ? (
                    <Box
                        sx={{
                            spacing:4,
                            py: 11,
                            textAlign: "center",
                            color: "text.secondary",
                            fontSize: 14,
                            bgcolor: "#ffffff",
                        }}
                    >
                        Chưa có bài học nào
                    </Box>
                ) : (
                    <Stack spacing={4} bgcolor={"#ffffff"}>
                        {course.lessons.slice(0, 5 ).map((l, idx) => (
                            <Stack
                                direction="row"
                                spacing={1.5}
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
                    <Stack alignItems={"center"} marginTop={"auto"} sx={{ mt: 2.25 }}>
                        <Button size="small" color={"#0f0c0cff"} sx={{ textTransform: "none" }}>
                            Xem thêm
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}