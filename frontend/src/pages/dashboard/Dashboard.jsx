import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import { getDashboardStats } from "../../api/dashboardApi";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    pendingExams: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {user?.name}
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-zinc-400">
            Total Exams
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.totalExams}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-zinc-400">
            Completed
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.completedExams}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-zinc-400">
            Pending
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stats.pendingExams}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;