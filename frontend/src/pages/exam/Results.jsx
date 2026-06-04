import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import api from "../../api/axios";

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get(
        "/exams/results"
      );

      setResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        My Results
      </h1>

      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
          >
            <h2 className="text-xl font-bold">
              {result.title}
            </h2>

            <p className="mt-2">
              Score: {result.score}
            </p>

            <p className="mt-1">
              Status: {result.status}
            </p>

            <p className="mt-1 text-zinc-400 text-sm">
              Attempt ID: {result.id}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Results;