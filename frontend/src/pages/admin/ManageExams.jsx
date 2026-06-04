import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getExams,
  deleteExam,
} from "../../api/examApi";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

      toast.success(
        "Exam Deleted"
      );

      fetchExams();

    } catch (error) {

      toast.error(
        "Delete Failed"
      );

    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Manage Exams
      </h1>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
          >
            <h2 className="text-xl font-bold">
              {exam.title}
            </h2>

            <p className="mt-2">
              {exam.description}
            </p>

            <p className="mt-2">
              Duration:
              {exam.duration} mins
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() =>
                  navigate(
                    `/admin/questions/${exam.id}`
                  )
                }
                className="bg-blue-500 px-4 py-2 rounded"
              >
                View Questions
              </button>

              <button
                onClick={() =>
                  handleDelete(exam.id)
                }
                className="bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageExams;