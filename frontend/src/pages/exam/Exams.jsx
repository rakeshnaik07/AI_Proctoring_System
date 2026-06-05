import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getExams } from "../../api/examApi";
import ExamCard from "../../components/exam/ExamCard";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Exams = () => {
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

  const handleStart = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Available Exams</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Select an exam to view instructions and begin.
        </p>
      </div>

      {/* Empty state */}
      {exams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={22} className="text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">No exams available</p>
          <p className="text-xs text-zinc-400 mt-1">Check back later for new exams.</p>
        </div>
      )}

      {/* Exam grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onStart={handleStart}
          />
        ))}
      </div>

    </DashboardLayout>
  );
};

export default Exams;