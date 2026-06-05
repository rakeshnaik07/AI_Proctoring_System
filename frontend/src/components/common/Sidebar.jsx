


import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  PlusCircle,
  FileQuestion,
  Trophy,
  Shield,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive(path)
        ? "bg-zinc-100 text-zinc-900 font-medium"
        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
    }`;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="w-60 bg-white border-r border-zinc-200 min-h-screen flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-zinc-900 rounded-md flex items-center justify-center flex-shrink-0">
          <Shield size={14} className="text-white" />
        </div>
        <h1 className="text-sm font-semibold text-zinc-900 tracking-tight">
          ProctorAI
        </h1>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 space-y-0.5 flex-1">

        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 pb-2 pt-1">
          Student
        </p>

        <Link to="/" className={navLinkClass("/")}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <Link to="/exams" className={navLinkClass("/exams")}>
          <BookOpen size={16} />
          Exams
        </Link>

        <Link to="/results" className={navLinkClass("/results")}>
          <Trophy size={16} />
          Results
        </Link>

        

        {user?.role === "admin" && (
          <>
            <div className="border-t border-zinc-100 my-3" />

            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 pb-2 pt-1">
              Admin
            </p>

            <Link to="/admin/create-exam" className={navLinkClass("/admin/create-exam")}>
              <PlusCircle size={16} />
              Create Exam
            </Link>

            <Link to="/admin/add-question" className={navLinkClass("/admin/add-question")}>
              <FileQuestion size={16} />
              Add Question
            </Link>

            <Link to="/admin/manage-exams" className={navLinkClass("/admin/manage-exams")}>
              <LayoutDashboard size={16} />
              Manage Exams
            </Link>
            <Link to="/admin/proctoring" className={navLinkClass("/admin/proctoring")}>
              <ShieldAlert size={16} />
                Proctoring
            </Link>
          </>
        )}
      </nav>

      {/* User info at bottom */}


      <Link to="/profile" className={navLinkClass("/profile")}>
          <div className="px-4 py-4 border-t border-zinc-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700 flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 truncate">{user?.name}</p>
          <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
        </div>
      </div>
      </Link>
      

    </div>
  );
};

export default Sidebar;



