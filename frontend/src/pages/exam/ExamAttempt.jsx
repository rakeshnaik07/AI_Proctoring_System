import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getQuestions,
  submitExam,
  saveAnswer,
} from "../../api/examApi";

import {
  createViolation,
  getViolations,
} from "../../api/violationApi";

import Timer from "../../components/exam/Timer";

const ExamAttempt = () => {
  const { examId } = useParams();

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [violationCount, setViolationCount] = useState(0);

  const fullscreenViolationRecorded = useRef(false);

  useEffect(() => {
    fetchQuestions();
    fetchViolations();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions(examId);
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchViolations = async () => {
    try {
      const attemptId = localStorage.getItem("attemptId");

      if (!attemptId) return;

      const data = await getViolations(attemptId);

      const existingViolations = data.violations || [];

      setViolationCount(existingViolations.length);
    } catch (error) {
      console.log(error);
    }
  };

  const recordViolation = async (violationType) => {
    try {
      const attemptId = localStorage.getItem("attemptId");

      if (!attemptId) return;

      const response = await createViolation({
        attemptId,
        violationType,
        confidence: 1,
      });

      if (
        response.message === "Violation Recorded"
      ) {
        setViolationCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (violationCount >= 5) {
      handleSubmit();
    }
  }, [violationCount]);

  const handleSelect = async (
    questionId,
    option
  ) => {
    try {
      const attemptId =
        localStorage.getItem(
          "attemptId"
        );

      setAnswers((prev) => ({
        ...prev,
        [questionId]: option,
      }));

      await saveAnswer(
        attemptId,
        questionId,
        option
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const attemptId =
        localStorage.getItem(
          "attemptId"
        );

      await submitExam(attemptId);

      localStorage.removeItem(
        "attemptId"
      );

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden) {
        recordViolation("TAB_SWITCH");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleTabSwitch
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleTabSwitch
      );
    };
  }, []);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log(error);
      }
    };

    enterFullscreen();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (!fullscreenViolationRecorded.current) {
          fullscreenViolationRecorded.current = true;

          recordViolation("FULLSCREEN_EXIT");
        }
      } else {
        fullscreenViolationRecorded.current = false;
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Exam Attempt
        </h1>

        <div className="flex gap-4 items-center">
          <Timer minutes={30} />

          <div className="bg-red-600 px-4 py-2 rounded-lg font-semibold">
            Violations: {violationCount}
          </div>
        </div>
      </div>

      {questions.map(
        (question, index) => (
          <div
            key={question.id}
            className="bg-zinc-900 p-6 rounded-xl mb-6"
          >
            <h2 className="font-semibold mb-4">
              Q{index + 1}.{" "}
              {question.question}
            </h2>

            <div className="space-y-3">
              {[
                {
                  label: "A",
                  value:
                    question.option_a,
                },
                {
                  label: "B",
                  value:
                    question.option_b,
                },
                {
                  label: "C",
                  value:
                    question.option_c,
                },
                {
                  label: "D",
                  value:
                    question.option_d,
                },
              ].map((option) => (
                <label
                  key={
                    option.label
                  }
                  className="flex gap-3"
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={
                      answers[
                        question.id
                      ] ===
                      option.label
                    }
                    onChange={() =>
                      handleSelect(
                        question.id,
                        option.label
                      )
                    }
                  />

                  {option.value}
                </label>
              ))}
            </div>
          </div>
        )
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded"
      >
        Submit Exam
      </button>
    </div>
  );
};

export default ExamAttempt;