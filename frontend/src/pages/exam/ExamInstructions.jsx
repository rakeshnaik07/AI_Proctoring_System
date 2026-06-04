import { useParams } from "react-router-dom";
import { startExam } from "../../api/examApi";
import { useNavigate } from "react-router-dom";

const ExamInstructions = () => {
  const { examId } = useParams();

  const navigate = useNavigate();

  const handleStartExam = async () => {
    try {
      const data = await startExam(
        Number(examId)
      );

      localStorage.setItem(
        "attemptId",
        data.attemptId
      );

      navigate(
        `/exam/${examId}/attempt`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl w-[700px]">
        <h1 className="text-3xl font-bold mb-6">
          Exam Instructions
        </h1>

        <ul className="space-y-4 text-zinc-300">
          <li>
            • Read all questions carefully.
          </li>

          <li>
            • Do not refresh page.
          </li>

          <li>
            • Submit before timer ends.
          </li>

          <li>
            • AI monitoring will be enabled in future.
          </li>
        </ul>

        <button
          onClick={handleStartExam}
          className="mt-8 bg-white text-black px-6 py-3 rounded-lg"
        >
          Start Now
        </button>
      </div>
    </div>
  );
};

export default ExamInstructions;