import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { http, LESSONS_URL } from "../lib/api";

export type LessonStatus = "completed" | "incomplete";

export type Lesson = {
  id: number;
  subject_id: number;
  lesson_name: string;
  time: number; // phút
  status: LessonStatus;
  created_at: string; // ISO
};

type State = {
  list: Lesson[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = { list: [], loading: false, error: null };

// ===== Thunks =====
export const fetchLessons = createAsyncThunk<Lesson[], number | undefined>(
  "lessons/fetch",
  async (subjectId) => {
    const url = subjectId ? `${LESSONS_URL}?subject_id=${subjectId}` : LESSONS_URL;
    return await http<Lesson[]>(url);
  }
);

export const addLesson = createAsyncThunk<
  Lesson,
  { subject_id: number; lesson_name: string; time: number; status: LessonStatus }
>("lessons/add", async (payload) => {
  const body = { ...payload, lesson_name: payload.lesson_name.trim(), created_at: new Date().toISOString() };
  return await http<Lesson>(LESSONS_URL, { method: "POST", body: JSON.stringify(body) });
});

export const updateLesson = createAsyncThunk<
  Lesson,
  { id: number; subject_id: number; lesson_name: string; time: number; status: LessonStatus }
>("lessons/update", async ({ id, ...rest }) => {
  const old = await http<Lesson>(`${LESSONS_URL}/${id}`);
  return await http<Lesson>(`${LESSONS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...rest, lesson_name: rest.lesson_name.trim(), created_at: old.created_at }),
  });
});

export const deleteLesson = createAsyncThunk<number, number>(
  "lessons/delete",
  async (id) => {
    await http(`${LESSONS_URL}/${id}`, { method: "DELETE" });
    return id;
  }
);

// ===== Slice =====
const slice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchLessons.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchLessons.fulfilled, (s, a:PayloadAction<Lesson[]>) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchLessons.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Fetch failed"; })

      .addCase(addLesson.pending,      (s) => { s.loading = true; s.error = null; })
      .addCase(addLesson.fulfilled,    (s, a:PayloadAction<Lesson>) => { s.loading = false; s.list.unshift(a.payload); })
      .addCase(addLesson.rejected,     (s, a) => { s.loading = false; s.error = a.error.message ?? "Add failed"; })

      .addCase(updateLesson.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(updateLesson.fulfilled, (s, a:PayloadAction<Lesson>) => {
        s.loading = false;
        const i = s.list.findIndex((x) => x.id === a.payload.id);
        if (i >= 0) s.list[i] = a.payload;
      })
      .addCase(updateLesson.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Update failed"; })

      .addCase(deleteLesson.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(deleteLesson.fulfilled, (s, a:PayloadAction<number>) => {
        s.loading = false;
        s.list = s.list.filter((x) => x.id !== a.payload);
      })
      .addCase(deleteLesson.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? "Delete failed"; });
  },
});

export default slice.reducer;
