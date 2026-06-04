import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  addQuestion,
  getExams,
} from "../../api/examApi";

import toast from "react-hot-toast";

const AddQuestion = () => {
  const [exams, setExams] = useState([]);

  const [formData, setFormData] =
    useState({
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
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addQuestion(formData);

      toast.success(
        "Question Added"
      );
    } catch (error) {
      toast.error(
        "Failed to Add Question"
      );
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Add Question
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl"
      >
        <select
          name="examId"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        >
          <option value="">
            Select Exam
          </option>

          {exams.map((exam) => (
            <option
              key={exam.id}
              value={exam.id}
            >
              {exam.title}
            </option>
          ))}
        </select>

        <textarea
          name="question"
          placeholder="Question"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          name="optionA"
          placeholder="Option A"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          name="optionB"
          placeholder="Option B"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          name="optionC"
          placeholder="Option C"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          name="optionD"
          placeholder="Option D"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          name="correctAnswer"
          placeholder="Correct Answer"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <button
          className="bg-white text-black px-6 py-3 rounded"
        >
          Add Question
        </button>
      </form>
    </DashboardLayout>
  );
};

export default AddQuestion;