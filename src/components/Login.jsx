import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("subham@gmail.com");
  const [password, setPassword] = useState("Subham@123");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.user));
      navigate("/");

      //   console.log(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl sm:p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-3xl shadow-lg shadow-indigo-500/10">
            🔐
          </div>

          {/* <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h2> */}

          <p className="mt-2 text-sm text-slate-400">
            Login to access your account
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <a
                href="/forgot-password"
                className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
              >
                Forgot password?
              </a>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-950/50 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/20 active:translate-y-0"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-500">SECURE ACCESS</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
