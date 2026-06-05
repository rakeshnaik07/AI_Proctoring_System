import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllAttemptsWithViolations, getViolations } from "../../api/violationApi";
import { ShieldAlert, ChevronRight, X, Clock, User, BookOpen } from "lucide-react";

const VIOLATION_COLORS = {
  NO_FACE:        { bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200"    },
  MULTIPLE_FACE:  { bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-200" },
  LOOKING_AWAY:   { bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200" },
  LOOKING_DOWN:   { bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200" },
  TAB_SWITCH:     { bg: "bg-purple-50",  text: "text-purple-600", border: "border-purple-200" },
  FULLSCREEN_EXIT:{ bg: "bg-zinc-100",   text: "text-zinc-600",   border: "border-zinc-200"   },
};

const defaultColor = { bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200" };

const riskLevel = (count) => {
  if (count === 0) return { label: "Clean",    color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200"  };
  if (count <= 2)  return { label: "Low",      color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" };
  if (count <= 4)  return { label: "Medium",   color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
  return             { label: "High",      color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"    };
};

const ProctoringDashboard = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);         // selected attempt for detail panel
  const [violations, setViolations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const data = await getAllAttemptsWithViolations();
      setAttempts(data.attempts || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (attempt) => {
    setSelected(attempt);
    setDetailLoading(true);
    try {
      const data = await getViolations(attempt.attemptId);
      setViolations(data.violations || []);
    } catch (error) {
      console.log(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setViolations([]);
  };

  const formatTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Proctoring Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} recorded.
        </p>
      </div>

      {/* Empty */}
      {!loading && attempts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert size={22} className="text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">No attempts yet</p>
          <p className="text-xs text-zinc-400 mt-1">Attempts will appear here once students take exams.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-zinc-400">Loading attempts...</p>
        </div>
      )}

      {/* Table + Detail layout */}
      {!loading && attempts.length > 0 && (
        <div className="flex gap-5 items-start">

          {/* Attempts table */}
          <div className={`bg-white rounded-xl border border-zinc-200 overflow-hidden transition-all ${selected ? "w-1/2" : "w-full"}`}>

            <div className="grid grid-cols-12 px-5 py-3 bg-zinc-50 border-b border-zinc-200">
              <span className="col-span-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Student</span>
              <span className="col-span-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Exam</span>
              <span className="col-span-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
              <span className="col-span-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Risk</span>
              <span className="col-span-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Detail</span>
            </div>

            {attempts.map((attempt) => {
              const risk = riskLevel(attempt.violationCount);
              const isActive = selected?.attemptId === attempt.attemptId;

              return (
                <div
                  key={attempt.attemptId}
                  className={`grid grid-cols-12 px-5 py-4 border-b border-zinc-100 last:border-b-0 items-center transition-colors ${
                    isActive ? "bg-violet-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-zinc-500" />
                    </div>
                    <span className="text-xs font-medium text-zinc-800 truncate">{attempt.studentName}</span>
                  </div>

                  <div className="col-span-3 flex items-center gap-1.5">
                    <BookOpen size={11} className="text-zinc-400 flex-shrink-0" />
                    <span className="text-xs text-zinc-600 truncate">{attempt.examTitle}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs font-semibold text-zinc-700">
                      {attempt.score != null ? `${attempt.score}%` : "—"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${risk.color} ${risk.bg} ${risk.border}`}>
                      {attempt.violationCount > 0 && <ShieldAlert size={10} />}
                      {risk.label} ({attempt.violationCount})
                    </span>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => isActive ? closeDetail() : openDetail(attempt)}
                      className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      {isActive ? "Close" : "View"}
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-1/2 bg-white rounded-xl border border-zinc-200 overflow-hidden flex-shrink-0">

              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{selected.studentName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{selected.examTitle}</p>
                </div>
                <button onClick={closeDetail} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-zinc-100">
                <div className="bg-zinc-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Score</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selected.score != null ? `${selected.score}%` : "—"}
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Violations</p>
                  <p className="text-sm font-semibold text-zinc-900">{selected.violationCount}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Submitted</p>
                  <p className="text-[11px] font-medium text-zinc-700">{formatTime(selected.submitted_at)}</p>
                </div>
              </div>

              {/* Violation list */}
              <div className="px-5 py-4">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Violation Log</p>

                {detailLoading && (
                  <p className="text-xs text-zinc-400 py-4 text-center">Loading...</p>
                )}

                {!detailLoading && violations.length === 0 && (
                  <div className="flex flex-col items-center py-8 text-center">
                    <p className="text-xs font-medium text-green-600">No violations recorded</p>
                    <p className="text-[11px] text-zinc-400 mt-1">This student had a clean session.</p>
                  </div>
                )}

                {!detailLoading && violations.length > 0 && (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {violations.map((v) => {
                      const color = VIOLATION_COLORS[v.violation_type] || defaultColor;
                      return (
                        <div
                          key={v.id}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${color.bg} ${color.border}`}
                        >
                          <span className={`text-xs font-semibold ${color.text}`}>
                            {v.violation_type.replace(/_/g, " ")}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                            <Clock size={10} />
                            {formatTime(v.created_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
};

export default ProctoringDashboard;