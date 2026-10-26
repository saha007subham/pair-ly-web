import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const isHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Release preview URLs when the preview changes or component unmounts.
  useEffect(() => {
    if (!photoPreview) return;

    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be 5 MB or less.");
      e.target.value = "";
      return;
    }

    setError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setError("");

    const input = document.getElementById("profile-photo-input");
    if (input) input.value = "";
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      let uploadedPhotoURL;

      // 1. Upload the selected photo to Cloudinary through Express.
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const uploadResponse = await axios.post(
          `${BASE_URL}/upload/profile-photo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );

        uploadedPhotoURL = uploadResponse.data?.photoURL;

        if (!uploadedPhotoURL || !isHttpsUrl(uploadedPhotoURL)) {
          throw new Error("Photo upload did not return a valid HTTPS URL.");
        }
      }

      // 2. Submit the profile using the returned HTTPS URL.
      const payload = {
        emailId: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age === "" ? undefined : Number(age),
        gender,
        about: about.trim(),
        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      if (uploadedPhotoURL) {
        payload.photoURL = uploadedPhotoURL;
      }

      const response = await axios.post(`${BASE_URL}/signup`, payload, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
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
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  required
                  minLength={2}
                  maxLength={26}
                  autoComplete="given-name"
                />
              </div>

              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  autoComplete="family-name"
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
                  placeholder="Enter your age (18-100)"
                  min={18}
                  max={100}
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

              {/* Profile Photo Uploader */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Profile Photo</label>

                <div className="mt-2 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 sm:flex-row">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500/30 bg-slate-800">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-12 w-12 text-slate-500"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 8h.01M12 12a3 3 0 100-6 3 3 0 000 6z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4-4a2 2 0 012.8 0l1.2 1.2 2.2-2.2a2 2 0 012.8 0L20 16"
                        />
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="font-medium text-white">
                      Upload your profile photo
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      JPG, PNG or WEBP. Maximum 5 MB.
                    </p>

                    <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20">
                      {photoFile ? "Choose Another Photo" : "Choose Photo"}

                      <input
                        id="profile-photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>

                    {photoFile && (
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                        <span className="max-w-48 truncate">
                          {photoFile.name}
                        </span>

                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
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

              {/* Skills */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Skills & Interests</label>
                <input
                  type="text"
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
            {loading
              ? "Uploading photo & creating account..."
              : "Create Account →"}
          </button>

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
