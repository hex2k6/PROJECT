import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type CourseStatus = "active" | "inactive";
export type Course = { id: number; name: string; status: CourseStatus };

export type CoursesState = {
  list: Course[];
  loading: boolean;
  error?: string | null;
};

const initialState: CoursesState = {
  list: [
    { id: 1, name: "Lập trình C", status: "active" },
    { id: 2, name: "Lập trình Frontend với ReactJS", status: "inactive" },
    { id: 3, name: "Lập trình Backend với Spring boot", status: "active" },
    { id: 4, name: "Lập trình Frontend với Vue.JS", status: "inactive" },
    { id: 5, name: "Cấu trúc dữ liệu và giải thuật", status: "inactive" },
    { id: 6, name: "Phân tích và thiết kế hệ thống", status: "inactive" },
    { id: 7, name: "Toán cao cấp", status: "active" },
    { id: 8, name: "Tiếng Anh chuyên ngành", status: "inactive" },
  ],
  loading: false,
  error: null,
};

// Giả lập API chậm 600ms
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (payload: Omit<Course, "id">) => {
    await delay();
    const id = Math.floor(Math.random() * 1_000_000);
    return { id, ...payload } as Course;
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (payload: Course) => {
    await delay();
    return payload;
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: number) => {
    await delay();
    return id;
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add
      .addCase(addCourse.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addCourse.fulfilled, (s, a: PayloadAction<Course>) => {
        s.loading = false;
        s.list.unshift(a.payload);
      })
      .addCase(addCourse.rejected, (s) => { s.loading = false; s.error = "Add failed"; })
      // update
      .addCase(updateCourse.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateCourse.fulfilled, (s, a: PayloadAction<Course>) => {
        s.loading = false;
        s.list = s.list.map((c) => (c.id === a.payload.id ? a.payload : c));
      })
      .addCase(updateCourse.rejected, (s) => { s.loading = false; s.error = "Update failed"; })
      // delete
      .addCase(deleteCourse.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deleteCourse.fulfilled, (s, a: PayloadAction<number>) => {
        s.loading = false;
        s.list = s.list.filter((c) => c.id !== a.payload);
      })
      .addCase(deleteCourse.rejected, (s) => { s.loading = false; s.error = "Delete failed"; });
  },
});

export default coursesSlice.reducer;
