import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageTransition from "../Components/PageTransition";
import toast from "react-hot-toast";
import api from "../api";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/register",
        { username, password, email },
        { withCredentials: true }
      );

      toast.success("Registered successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body p-6 sm:p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <img src="/JournexLogo.png" alt="Journex logo" className="h-12 object-contain mb-2" />
              <h1 className="text-3xl font-bold text-primary">
                Journex
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                Welcome to Journex
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={18} />
                    Create Account
                  </span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-semibold"
              >
                Log In
              </Link>
            </p>

            <p className="text-center text-sm text-base-content/60 mt-2">
              <Link
                to="/"
                className="text-primary hover:underline"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}