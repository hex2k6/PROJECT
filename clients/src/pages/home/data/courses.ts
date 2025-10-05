export type Lesson = { name: string; done?: boolean };
export type Course = {
  id: number;
  title: string;
  lessons: Lesson[];
  doneCount?: number;
};

export const COURSES: Course[] = [
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
