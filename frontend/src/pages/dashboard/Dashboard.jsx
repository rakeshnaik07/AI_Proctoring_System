// import { useEffect, useState } from "react";

// import DashboardLayout from "../../layouts/DashboardLayout";
// import { useAuth } from "../../context/AuthContext";

// import { getDashboardStats } from "../../api/dashboardApi";

// const Dashboard = () => {
//   const { user } = useAuth();

//   const [stats, setStats] = useState({
//     totalExams: 0,
//     completedExams: 0,
//     pendingExams: 0,
//   });

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const data = await getDashboardStats();

//       setStats(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <h1 className="text-3xl font-bold mb-8">
//         Welcome, {user?.name}
//       </h1>

//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
//           <h2 className="text-zinc-400">
//             Total Exams
//           </h2>

//           <p className="text-3xl font-bold mt-2">
//             {stats.totalExams}
//           </p>
//         </div>

//         <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
//           <h2 className="text-zinc-400">
//             Completed
//           </h2>

//           <p className="text-3xl font-bold mt-2">
//             {stats.completedExams}
//           </p>
//         </div>

//         <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
//           <h2 className="text-zinc-400">
//             Pending
//           </h2>

//           <p className="text-3xl font-bold mt-2">
//             {stats.pendingExams}
//           </p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;


import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats } from "../../api/dashboardApi";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

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

  const statCards = [
    {
      label: "Total Exams",
      value: stats.totalExams,
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      sub: "Assigned to you",
    },
    {
      label: "Completed",
      value: stats.completedExams,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      sub: "All submitted",
    },
    {
      label: "Pending",
      value: stats.pendingExams,
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      sub: "Due soon",
    },
  ];

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">
          Hello, {user?.name} 👋
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Here's an overview of your exam activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-zinc-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    {card.label}
                  </p>
                  <p className="text-3xl font-semibold text-zinc-900">
                    {card.value}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">{card.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={17} className={card.iconColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="mb-2">
        <p className="text-sm font-semibold text-zinc-700 mb-3">Quick Actions</p>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/exams"
            className="text-sm bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Browse Exams →
          </a>
          <a
            href="/results"
            className="text-sm bg-white text-zinc-700 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            View Results
          </a>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;