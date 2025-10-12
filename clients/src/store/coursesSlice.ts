import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { http, SUBJECTS_URL } from "../lib/api";

export type CourseStatus = "active" | "inactive";
export type Course = {
  id: number;
  subject_name: string;
  status: CourseStatus;
  created_at: string; // ISO
};

type State = {
  list: Course[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = { list: [], loading: false, error: null };

// ---- Thunks ----
export const fetchCourses = createAsyncThunk<Course[]>(
  "courses/fetchAll",
  async () => await http<Course[]>(SUBJECTS_URL)
);

export const addCourse = createAsyncThunk<
  Course,
  { subject_name: string; status: CourseStatus }
>("courses/add", async ({ subject_name, status }) => {
  const body = {
    subject_name: subject_name.trim(),
    status,
    created_at: new Date().toISOString(),
  };
  return await http<Course>(SUBJECTS_URL, { method: "POST", body: JSON.stringify(body) });
});

export const updateCourse = createAsyncThunk<
  Course,
  { id: number; subject_name: string; status: CourseStatus }
>("courses/update", async ({ id, subject_name, status }) => {
  // giữ created_at cũ
  const old = await http<Course>(`${SUBJECTS_URL}/${id}`);
  return await http<Course>(`${SUBJECTS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, subject_name: subject_name.trim(), status, created_at: old.created_at }),
  });
});

export const deleteCourse = createAsyncThunk<number, number>(
  "courses/delete",
  async (id) => {
    await http(`${SUBJECTS_URL}/${id}`, { method: "DELETE" });
    return id;
  }
);

const slice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      // fetch
      .addCase(fetchCourses.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCourses.fulfilled, (s, a:PayloadAction<Course[]>) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchCourses.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Fetch failed"; })
      // add
      .addCase(addCourse.pending,      (s) => { s.loading = true; s.error = null; })
      .addCase(addCourse.fulfilled,    (s, a:PayloadAction<Course>) => { s.loading = false; s.list.unshift(a.payload); })
      .addCase(addCourse.rejected,     (s, a) => { s.loading = false; s.error = a.error.message ?? "Add failed"; })
      // update
      .addCase(updateCourse.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(updateCourse.fulfilled, (s, a:PayloadAction<Course>) => {
        s.loading = false; const i = s.list.findIndex(x => x.id === a.payload.id); if (i>=0) s.list[i] = a.payload;
      })
      .addCase(updateCourse.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Update failed"; })
      // delete
      .addCase(deleteCourse.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(deleteCourse.fulfilled, (s, a:PayloadAction<number>) => {
        s.loading = false; s.list = s.list.filter(x => x.id !== a.payload);
      })
      .addCase(deleteCourse.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Delete failed"; });
  },
});

export default slice.reducer;
