import { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      login(data.user, data.token);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors";

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-3">
            <Shield size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">ProctorAI</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-zinc-700 transition-colors mt-2"
            >
              Sign In
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-zinc-900 font-semibold hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;