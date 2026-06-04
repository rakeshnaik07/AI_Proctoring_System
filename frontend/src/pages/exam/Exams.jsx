import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { getExams } from "../../api/examApi";

import ExamCard from "../../components/exam/ExamCard";

import { useNavigate } from "react-router-dom";

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
      <h1 className="text-3xl font-bold mb-8">
        Available Exams
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
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