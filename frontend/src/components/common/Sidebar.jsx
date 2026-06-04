import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  PlusCircle,
  FileQuestion,
  Trophy,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white">
          AI Proctor
        </h1>
      </div>

      <nav className="px-4 py-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/exams"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
        >
          <BookOpen size={18} />
          Exams
        </Link>
        <Link
  to="/results"
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
>
  <Trophy size={18} />
  Results
</Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
        >
          <User size={18} />
          Profile
        </Link>

        {user?.role === "admin" && (
          <>
            <div className="border-t border-zinc-800 my-4"></div>

            <Link
              to="/admin/create-exam"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
            >
              <PlusCircle size={18} />
              Create Exam
            </Link>

            <Link
              to="/admin/add-question"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
            >
              <FileQuestion size={18} />
              Add Question
            </Link>
            <Link
  to="/admin/manage-exams"
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 text-white"
>
  Manage Exams
</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;