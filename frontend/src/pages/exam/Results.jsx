import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { Trophy, Download } from "lucide-react";

const Results = () => {
  const [results, setResults] = useState([]);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get("/exams/results");
      setResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadPDF = async (attemptId, examTitle) => {
    setDownloading(attemptId);
    try {
      const response = await api.get(`/exams/result-pdf/${attemptId}`, {
        responseType: "blob",
      });

      // Create a temporary link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `result-${examTitle}-${attemptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    } finally {
      setDownloading(null);
    }
  };

  const getScoreStyle = (score) => {
    if (score >= 80) return { pill: "bg-green-50 text-green-700", label: "Excellent" };
    if (score >= 50) return { pill: "bg-amber-50 text-amber-700", label: "Average" };
    return { pill: "bg-red-50 text-red-600", label: "Low" };
  };

  const getStatusStyle = (status) => {
    if (status === "completed") return "bg-green-50 text-green-700";
    return "bg-zinc-100 text-zinc-500";
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">My Results</h1>
        <p className="text-sm text-zinc-500 mt-1">Your exam history and scores.</p>
      </div>

      {/* Empty state */}
      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <Trophy size={22} className="text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">No results yet</p>
          <p className="text-xs text-zinc-400 mt-1">Complete an exam to see your score here.</p>
        </div>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-5 px-5 py-3 bg-zinc-50 border-b border-zinc-200">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Exam</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Status</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Attempt</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Report</span>
          </div>

          {/* Rows */}
          {results.map((result) => {
            const scoreStyle = getScoreStyle(result.score);
            const isDownloading = downloading === result.id;

            return (
              <div
                key={result.id}
                className="grid grid-cols-5 px-5 py-4 border-b border-zinc-100 last:border-b-0 items-center hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">{result.title}</p>
                </div>

                <div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${scoreStyle.pill}`}>
                    {result.score} pts
                  </span>
                </div>

                <div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${getStatusStyle(result.status)}`}>
                    {result.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-zinc-400">#{result.id}</span>
                </div>

                <div>
                  {result.status === "completed" ? (
                    <button
                      onClick={() => handleDownloadPDF(result.id, result.title)}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Download size={12} />
                      {isDownloading ? "..." : "PDF"}
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </DashboardLayout>
  );
};

export default Results;