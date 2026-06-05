import { useEffect, useState, useRef, useCallback } from "react";
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

import WebcamMonitor from "../../ai/components/WebcamMonitor";
import useFaceDetection from "../../ai/hooks/useFaceDetection";
import useAIViolations from "../../ai/hooks/useAIViolations";

const ExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(null);

  const fullscreenViolationRecorded = useRef(false);
  const isSubmitting = useRef(false); // prevents double-submit

  // Guard: if no attemptId, exam is not active — redirect away
useEffect(() => {
  const attemptId = localStorage.getItem("attemptId");
  if (!attemptId) {
    navigate("/exams", { replace: true });
  }
}, []);

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

  const recordViolation = useCallback(async (violationType) => {
    try {
      const attemptId = localStorage.getItem("attemptId");
      if (!attemptId) return;
      const response = await createViolation({
        attemptId,
        violationType,
        confidence: 1,
      });
      if (response.message === "Violation Recorded") {
        setViolationCount((prev) => prev + 1);
        setShowWarning(violationType);
        setTimeout(() => setShowWarning(null), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (violationCount >= 5) {
      handleSubmit();
    }
  }, [violationCount]);

  const handleSelect = async (questionId, option) => {
    try {
      const attemptId = localStorage.getItem("attemptId");
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
      await saveAnswer(attemptId, questionId, option);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting.current) return; // prevent double submit
    isSubmitting.current = true;
    try {
      const attemptId = localStorage.getItem("attemptId");
      await submitExam(attemptId);
      localStorage.removeItem("attemptId");
      navigate("/results");
    } catch (error) {
      console.log(error);
      isSubmitting.current = false;
    }
  }, [navigate]);

  // --- Block browser back button ---
  useEffect(() => {
    // Push a dummy state so there's something to intercept
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Every time back is pressed, push forward again to block it
      window.history.pushState(null, "", window.location.href);
      setShowWarning("BACK_BLOCKED");
      setTimeout(() => setShowWarning(null), 3000);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // --- Auto submit on page unload (tab close / refresh / direct URL change) ---
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const attemptId = localStorage.getItem("attemptId");
      if (!attemptId) return;

      // Best-effort beacon submit — works even as page closes
      navigator.sendBeacon(
        `http://localhost:5000/api/exam-attempts/${attemptId}/submit`
      );

      // Show browser's native "are you sure?" dialog
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleTabSwitch = () => {
      if (document.hidden) {
        recordViolation("TAB_SWITCH");
      }
    };
    document.addEventListener("visibilitychange", handleTabSwitch);
    return () => {
      document.removeEventListener("visibilitychange", handleTabSwitch);
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
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const videoRef = useRef(null);

  const {
    faces,
    noFace,
    multipleFaces,
    direction,
    livePoseViolation,
    poseViolation,
    poseViolationProgress,
    requiredPoseFrames,
  } = useFaceDetection(videoRef);

  const attemptId = localStorage.getItem("attemptId");
  useAIViolations({
    noFace,
    multipleFaces,
    poseViolation,
    attemptId,
    createViolation: recordViolation,
  });

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const options = currentQuestion
    ? [
        { label: "A", value: currentQuestion.option_a },
        { label: "B", value: currentQuestion.option_b },
        { label: "C", value: currentQuestion.option_c },
        { label: "D", value: currentQuestion.option_d },
      ]
    : [];

  const warningMessage = {
    TAB_SWITCH:      "Tab switch detected!",
    FULLSCREEN_EXIT: "Fullscreen exit detected!",
    NO_FACE:         "No face detected!",
    MULTIPLE_FACE:   "Multiple faces detected!",
    LOOKING_AWAY:    "Looking away detected!",
    LOOKING_DOWN:    "Looking down detected!",
    BACK_BLOCKED:    "You cannot go back during the exam!",
  };

  const movementLabel = poseViolation
    ?? (
      livePoseViolation
        ? `${livePoseViolation} ${poseViolationProgress}/${requiredPoseFrames}`
        : "Normal"
    );

  const movementClass = poseViolation
    ? "text-red-500"
    : livePoseViolation
    ? "text-amber-600"
    : "text-green-600";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {showWarning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-xl shadow-md">
          ⚠ {warningMessage[showWarning] ?? showWarning}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white border-b border-zinc-200 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-zinc-900">Exam in Progress</p>
          <div className="h-4 w-px bg-zinc-200" />
          <p className="text-xs text-zinc-500">
            {answeredCount} / {questions.length} answered
          </p>
          <div className="w-28 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all"
              style={{ width: questions.length ? `${(answeredCount / questions.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-amber-600 font-medium">Time Left</span>
            <Timer minutes={30} />
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            violationCount >= 3
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-zinc-100 border-zinc-200 text-zinc-600"
          }`}>
            ⚠ {violationCount} Violations
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Question panel */}
        <div className="flex-1 p-8 overflow-y-auto">
          {currentQuestion ? (
            <>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <h2 className="text-base font-semibold text-zinc-900 leading-relaxed mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-8">
                {options.map((option) => (
                  <label
                    key={option.label}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option.label
                        ? "border-violet-400 bg-violet-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      checked={answers[currentQuestion.id] === option.label}
                      onChange={() => handleSelect(currentQuestion.id, option.label)}
                      className="hidden"
                    />
                    <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      answers[currentQuestion.id] === option.label
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "border-zinc-300 text-zinc-500"
                    }`}>
                      {option.label}
                    </div>
                    <span className={`text-sm ${
                      answers[currentQuestion.id] === option.label
                        ? "text-zinc-900 font-medium"
                        : "text-zinc-600"
                    }`}>
                      {option.value}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="text-sm px-5 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                    className="text-sm px-5 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="text-sm px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-zinc-400">Loading questions...</p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-56 bg-white border-l border-zinc-200 p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0">

          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Webcam</p>
            <div className="rounded-lg overflow-hidden bg-zinc-900 aspect-video relative">
              <WebcamMonitor videoRef={videoRef} />
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-[9px] text-white font-medium">LIVE</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Proctoring</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                <span className="text-xs text-zinc-500">Faces</span>
                <span className="text-xs font-semibold text-zinc-700">{faces}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                <span className="text-xs text-zinc-500">No Face</span>
                <span className={`text-xs font-semibold ${noFace ? "text-red-500" : "text-green-600"}`}>
                  {noFace ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-zinc-500">Multi-Face</span>
                <span className={`text-xs font-semibold ${multipleFaces ? "text-red-500" : "text-green-600"}`}>
                  {multipleFaces ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-zinc-100">
                <span className="text-xs text-zinc-500">Direction</span>
                <span className="text-xs font-semibold text-zinc-700">{direction}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-zinc-500">Movement</span>
                <span className={`text-xs font-semibold text-right ${movementClass}`}>
                  {movementLabel}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Questions</p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 rounded-md text-[11px] font-semibold transition-colors ${
                    i === currentIndex
                      ? "bg-violet-600 text-white"
                      : answers[q.id]
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block" /> Done
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-600 inline-block" /> Current
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-100 border border-zinc-200 inline-block" /> Pending
              </span>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Exam
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExamAttempt;