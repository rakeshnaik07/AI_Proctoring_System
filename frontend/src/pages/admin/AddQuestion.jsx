import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addQuestion, getExams } from "../../api/examApi";
import toast from "react-hot-toast";
import { FileQuestion } from "lucide-react";

const AddQuestion = () => {
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    examId: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const data = await getExams();
    setExams(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addQuestion(formData);
      toast.success("Question Added");
    } catch (error) {
      toast.error("Failed to Add Question");
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors";

  return (
    <DashboardLayout>
      <div className="max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900">Add Question</h1>
          <p className="text-sm text-zinc-500 mt-1">Add an MCQ question to an existing exam.</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Exam select */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Select Exam</label>
              <select
                name="examId"
                onChange={handleChange}
                value={formData.examId}
                className={inputClass}
              >
                <option value="">Choose an exam...</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Question</label>
              <textarea
                name="question"
                placeholder="Type the question here..."
                onChange={handleChange}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Options grid */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Options</label>
              <div className="grid grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((letter) => (
                  <div key={letter} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                      {letter}
                    </span>
                    <input
                      name={`option${letter}`}
                      placeholder={`Option ${letter}`}
                      onChange={handleChange}
                      className={inputClass + " pl-8"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct answer */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Correct Answer</label>
              <select
                name="correctAnswer"
                onChange={handleChange}
                value={formData.correctAnswer}
                className={inputClass}
              >
                <option value="">Select correct option...</option>
                {["A", "B", "C", "D"].map((letter) => (
                  <option key={letter} value={letter}>Option {letter}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <button
                type="submit"
                className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <FileQuestion size={15} />
                Add Question
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddQuestion;