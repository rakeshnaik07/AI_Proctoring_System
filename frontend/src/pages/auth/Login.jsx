import { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-zinc-900 p-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          onChange={handleChange}
        />

        <button
          className="w-full bg-white text-black py-3 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-blue-400"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;