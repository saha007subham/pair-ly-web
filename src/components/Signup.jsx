import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("male");

  // Additional profile fields
  const [photoURL, setPhotoURL] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          emailId: email.trim().toLowerCase(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: Number(age),
          gender,
          photoURL: photoURL.trim() || undefined,
          about: about.trim(),
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      if (res.status === 200 || res.status === 201) {
        navigate("/login");
      }

      console.log("Signup successful:", res);
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-8 text-center sm:px-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-3xl shadow-lg shadow-indigo-500/10">
            ✨
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Join us and create your profile
          </p>
        </div>

        <form className="space-y-7 p-6 sm:p-10" onSubmit={handleCreateProfile}>
          {/* Basic Information */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-5 w-1 rounded-full bg-indigo-500" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Password *</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                  minLength={8}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Use a strong password to protect your account.
                </p>
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-5 w-1 rounded-full bg-violet-500" />
              Personal Details
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  min="0"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option className="bg-slate-900" value="male">
                    Male
                  </option>
                  <option className="bg-slate-900" value="female">
                    Female
                  </option>
                  <option className="bg-slate-900" value="other">
                    Other
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Photo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className={inputClass}
                />

                {photoURL.trim() && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3">
                    <img
                      src={photoURL}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full border border-slate-700 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                      }}
                    />
                    <span className="text-sm text-slate-400">
                      Profile photo preview
                    </span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>About You</label>
                <textarea
                  placeholder="Tell us about yourself and your interests..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-1 text-right text-xs text-slate-500">
                  {about.length}/300 characters
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Skills & Interests</label>
                <input
                  placeholder="React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Separate skills with commas.
                </p>

                {skills.trim() && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-950/50 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating your account..." : "Create Account →"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
