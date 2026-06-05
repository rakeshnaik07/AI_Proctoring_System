import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Profile</h1>
        <p className="text-sm text-zinc-500 mt-1">Your account details.</p>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-lg font-bold text-violet-700 flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-900">{user?.name}</p>
              <span className="inline-block text-xs font-semibold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded capitalize mt-1">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Name</p>
                <p className="text-sm text-zinc-900 font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Email</p>
                <p className="text-sm text-zinc-900 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={14} className="text-zinc-500" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Role</p>
                <p className="text-sm text-zinc-900 font-medium capitalize">{user?.role}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default Profile;