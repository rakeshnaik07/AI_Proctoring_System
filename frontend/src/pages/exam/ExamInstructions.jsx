import { useParams } from "react-router-dom";
import { startExam } from "../../api/examApi";
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle, Clock, Monitor, Camera } from "lucide-react";

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  

  const handleStartExam = async () => {
    try {
      const data = await startExam(Number(examId));
      localStorage.setItem("attemptId", data.attemptId);
      navigate(`/exam/${examId}/attempt`);
    } catch (error) {
      console.log(error);
    }
  };

  const instructions = [
    {
      icon: AlertCircle,
      text: "Read all questions carefully before selecting your answer.",
    },
    {
      icon: Clock,
      text: "Submit before the timer ends. Auto-submit will trigger on timeout.",
    },
    {
      icon: Monitor,
      text: "Do not refresh the page or switch tabs during the exam.",
    },
    {
      icon: Camera,
      text: "AI webcam monitoring is active. Ensure your face is clearly visible.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-zinc-200 w-full max-w-lg p-8">

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">Exam Instructions</h1>
            <p className="text-xs text-zinc-400">Read carefully before starting</p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 flex items-start gap-2.5">
          <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-medium">
            5 or more violations will auto-submit your exam. Stay focused.
          </p>
        </div>

        {/* Instructions list */}
        <ul className="space-y-3 mb-8">
          {instructions.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-zinc-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={13} className="text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-600">{item.text}</p>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="border-t border-zinc-100 mb-6" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            ← Go Back
          </button>

          <button
            onClick={handleStartExam}
            className="bg-zinc-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Start Exam →
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExamInstructions;