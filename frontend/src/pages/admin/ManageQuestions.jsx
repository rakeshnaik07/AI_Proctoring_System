import { useEffect, useState } from "react";
import { getQuestions, deleteQuestion } from "../../api/examApi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, FileQuestion } from "lucide-react";

const ManageQuestions = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions(examId);
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      toast.success("Question Deleted");
      loadQuestions();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const optionLabels = ["A", "B", "C", "D"];
  const optionKeys = ["option_a", "option_b", "option_c", "option_d"];

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Manage Questions</h1>
        <p className="text-sm text-zinc-500 mt-1">{questions.length} question{questions.length !== 1 ? "s" : ""} in this exam.</p>
      </div>

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <FileQuestion size={22} className="text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">No questions yet</p>
          <p className="text-xs text-zinc-400 mt-1">Add questions to this exam first.</p>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-xl border border-zinc-200 p-5"
          >
            {/* Question header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                  {question.question}
                </p>
              </div>

              <button
                onClick={() => handleDelete(question.id)}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-2">
              {optionKeys.map((key, i) => (
                <div
                  key={key}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100"
                >
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-zinc-400 bg-white border border-zinc-200 flex-shrink-0">
                    {optionLabels[i]}
                  </span>
                  <span className="text-xs text-zinc-600">{question[key]}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default ManageQuestions;