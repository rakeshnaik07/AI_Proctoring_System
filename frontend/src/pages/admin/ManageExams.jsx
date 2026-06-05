import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getExams, deleteExam } from "../../api/examApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Trash2, List } from "lucide-react";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await getExams();
      setExams(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExam(id);
      toast.success("Exam Deleted");
      fetchExams();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Manage Exams</h1>
        <p className="text-sm text-zinc-500 mt-1">{exams.length} exam{exams.length !== 1 ? "s" : ""} total.</p>
      </div>

      {/* Empty state */}
      {exams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <List size={22} className="text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">No exams yet</p>
          <p className="text-xs text-zinc-400 mt-1">Create an exam first.</p>
        </div>
      )}

      {/* Table */}
      {exams.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">

          {/* Header row */}
          <div className="grid grid-cols-12 px-5 py-3 bg-zinc-50 border-b border-zinc-200">
            <span className="col-span-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Exam</span>
            <span className="col-span-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Duration</span>
            <span className="col-span-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Actions</span>
          </div>

          {/* Rows */}
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="grid grid-cols-12 px-5 py-4 border-b border-zinc-100 last:border-b-0 items-center hover:bg-zinc-50 transition-colors"
            >
              <div className="col-span-5">
                <p className="text-sm font-medium text-zinc-900">{exam.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{exam.description}</p>
              </div>

              <div className="col-span-3">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock size={12} />
                  {exam.duration} mins
                </span>
              </div>

              <div className="col-span-4 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/questions/${exam.id}`)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                >
                  <List size={12} />
                  Questions
                </button>

                <button
                  onClick={() => handleDelete(exam.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default ManageExams;