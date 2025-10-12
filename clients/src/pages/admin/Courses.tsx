import {
  Box, Container, Stack, Typography, Select, MenuItem, Button, TextField,
  InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, Chip,
  IconButton, Pagination, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchCourses, addCourse, updateCourse, deleteCourse,
  type Course, type CourseStatus
} from "../../store/coursesSlice";
import CourseFormDialog from "../../components/admin/CourseFormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingScreen from "../../components/common/LoadingScreen";
import Toast from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";

const ROW_H = 56;

function StatusChip({ value }: { value: CourseStatus }) {
  const dot = <Box component="span" sx={{ width:6, height:6, borderRadius:"50%", mr:1, display:"inline-block",
    bgcolor: value === "active" ? "#22c55e" : "#ef4444" }} />;
  return value === "active"
    ? <Chip size="small" label={<Box sx={{display:"inline-flex",alignItems:"center"}}>{dot}Đang hoạt động</Box>}
            sx={{ bgcolor:"#eaf8f0", color:"#1a7f37", borderColor:"#bfe8cf" }} variant="outlined" />
    : <Chip size="small" label={<Box sx={{display:"inline-flex",alignItems:"center"}}>{dot}Ngừng hoạt động</Box>}
            sx={{ bgcolor:"#fdeeee", color:"#c62828", borderColor:"#f6b9b9" }} variant="outlined" />;
}

type Pending =
  | { type:"none" }
  | { type:"save"; payload:{ subject_name:string; status:CourseStatus }; editing?: Course|null }
  | { type:"delete"; id:number; name:string };

export default function Courses(){
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list, loading } = useSelector((s:RootState)=>s.courses);

  const [status, setStatus] = useState<"all"|"active"|"inactive">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Course|null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<Pending>({type:"none"});
  const [toast, setToast] = useState<{open:boolean; msg?:string}>({open:false});

  const rowsPerPage = 8;

  useEffect(()=>{ dispatch(fetchCourses()); },[dispatch]);

  const filtered = useMemo(()=>{
    let d = list;
    if(status!=="all") d = d.filter(c=>c.status===status);
    if(q.trim()) d = d.filter(c=>c.subject_name.toLowerCase().includes(q.toLowerCase()));
    return d;
  },[list,status,q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const current = filtered.slice((safePage-1)*rowsPerPage, safePage*rowsPerPage);

  const openAdd = ()=>{ setEditing(null); setOpenForm(true); };
  const openEdit = (c:Course)=>{ setEditing(c); setOpenForm(true); };

  const handleSubmitForm = (data:{subject_name:string; status:CourseStatus})=>{
    setPending({type:"save", payload:data, editing});
    setConfirmOpen(true);
  };

  const askDelete = (c:Course)=>{
    setPending({type:"delete", id:c.id, name:c.subject_name});
    setConfirmOpen(true);
  };

  const handleConfirm = async ()=>{
    try{
      if(pending.type==="save"){
        if(pending.editing){
          await dispatch(updateCourse({ id: pending.editing.id, ...pending.payload })).unwrap();
          setToast({open:true, msg:"Cập nhật môn học thành công"});
        }else{
          await dispatch(addCourse(pending.payload)).unwrap();
          setToast({open:true, msg:"Thêm môn học thành công"});
        }
        setOpenForm(false);
      }else if(pending.type==="delete"){
        await dispatch(deleteCourse(pending.id)).unwrap();
        setToast({open:true, msg:`Xóa môn học "${pending.name}" thành công`});
      }
    }catch{
      setToast({open:true, msg:"Có lỗi xảy ra, vui lòng thử lại"});
    }finally{
      setConfirmOpen(false); setPending({type:"none"});
    }
  };

  return (
    <>
      {loading && <LoadingScreen/>}

      <Container maxWidth="100" sx={{ py:3, bgcolor:"#ffffff" }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb:2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MoreHorizIcon sx={{ color:"text.secondary" }}/>
            <Typography variant="h5" fontWeight={700}>Môn học</Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ alignItems:"center" }}>
            <Select
              value={status}
              onChange={(e)=>{ setStatus(e.target.value as any); setPage(1); }}
              size="small"
              sx={{ minWidth:200, bgcolor:"#ffffff",
                ".MuiOutlinedInput-notchedOutline":{ borderColor:"#e6ebf2" } }}
            >
              <MenuItem value="all">Lọc theo trạng thái</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>
            <Button variant="contained" startIcon={<AddIcon/>} sx={{ height:40 }} onClick={openAdd}>
              Thêm mới môn học
            </Button>
          </Stack>
        </Stack>

        {/* Search */}
        <Stack alignItems="end">
          <TextField
            placeholder="Tìm kiếm môn học theo tên..."
            value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }}
            size="small"
            sx={{ width:360, bgcolor:"#ffffff", ".MuiOutlinedInput-notchedOutline":{ borderColor:"#e6ebf27a" } }}
            InputProps={{ endAdornment:
              <InputAdornment position="end"><SearchIcon sx={{ color:"text.disabled" }}/></InputAdornment> }}
          />
        </Stack>

        {/* Table */}
        <Box sx={{ py:1.5, bgcolor:"#ffffff", overflow:"hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight:700, bgcolor:"#f6f8fc", color:"text.secondary", py:1.5 }} width="60%">
                  Tên môn học
                </TableCell>
                <TableCell sx={{ fontWeight:700, bgcolor:"#f6f8fc", color:"text.secondary", py:1.5 }} width="20%">
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight:700, bgcolor:"#f6f8fc", color:"text.secondary", py:1.5 }} width="20%" align="center">
                  Chức năng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current.map((c)=>(
                <TableRow
                  key={c.id} hover
                  onClick={()=> navigate(`/admin/lessons?subjectId=${c.id}&subjectName=${encodeURIComponent(c.subject_name)}`)}
                  sx={{ cursor:"pointer", "& td":{ borderBottom:"1px solid #f0f2f7", height:ROW_H, py:2.5 },
                        "&:last-of-type td":{ borderBottom:"none" } }}
                >
                  <TableCell sx={{ fontSize:14 }}>{c.subject_name}</TableCell>
                  <TableCell><StatusChip value={c.status}/></TableCell>
                  <TableCell
                    align="center"
                    onClick={(e)=>e.stopPropagation()} // tránh trigger navigation khi bấm icon
                  >
                    <IconButton size="small" sx={{ color:"#ef4444", mr:0.5 }} onClick={()=>askDelete(c)}>
                      <DeleteOutlineIcon fontSize="small"/>
                    </IconButton>
                    <IconButton size="small" sx={{ color:"#fb923c" }} onClick={()=>openEdit(c)}>
                      <EditOutlinedIcon fontSize="small"/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {current.length===0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py:6, color:"text.secondary" }}>Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Divider/>

          <Stack alignItems="center" sx={{ py:2.5 }}>
            <Pagination
              color="primary" page={safePage} onChange={(_,p)=>setPage(p)}
              count={totalPages<10?totalPages:10} siblingCount={1} boundaryCount={1}
              showFirstButton showLastButton
              sx={{
                "& .MuiPaginationItem-root":{ borderRadius:1.5, minWidth:32, height:32 },
                "& .MuiPaginationItem-root:not(.Mui-selected)":{ border:"1px solid #e6ebf2" },
                "& .Mui-selected":{ boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.04)" },
              }}
            />
          </Stack>
        </Box>
      </Container>

      {/* Dialog thêm/sửa */}
      <CourseFormDialog
        open={openForm}
        initial={editing ?? undefined}
        onClose={()=>setOpenForm(false)}
        onSubmit={handleSubmitForm}
      />

      {/* Xác nhận */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận"
        description={
          pending.type === "delete"
            ? <>Bạn có chắc chắn muốn xóa môn học: <b>{pending.name}</b> khỏi hệ thống không?</>
            : "Bạn có đồng ý với thao tác này?"
        }
        confirmText={pending.type==="delete" ? "Xóa" : "Lưu"}
        cancelText="Hủy"
        onClose={()=>{ setConfirmOpen(false); setPending({type:"none"}); }}
        onConfirm={handleConfirm}
      />

      {/* Toast */}
      <Toast open={toast.open} title="Thành công" message={toast.msg} onClose={()=>setToast({open:false})}/>
    </>
  );
}
