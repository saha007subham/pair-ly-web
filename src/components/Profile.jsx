import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserRound,
  FileText,
  Code2,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Camera,
  Upload,
  X,
} from "lucide-react";

import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const Profile = () => {
  const user = useSelector((store) => store.user?.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [about, setAbout] = useState(user?.about ?? "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : (user?.skills ?? ""),
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // Sync form fields with Redux user data.
  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhotoURL(user?.photoURL ?? "");
    setAbout(user?.about ?? "");
    setSkills(
      Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : (user?.skills ?? ""),
    );
  }, [user]);

  // Clean up preview object URL on unmount or preview change.
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // Automatically dismiss notifications.
  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please select a JPG, PNG, or WEBP image.",
      });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "Image size must be 5 MB or less.",
      });
      e.target.value = "";
      return;
    }

    setMessage({ type: "", text: "" });
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemoveSelectedPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview("");

    const input = document.getElementById("profile-photo-upload");
    if (input) input.value = "";
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let finalPhotoURL = photoURL;

      // 1. Upload photo to server if a new file was selected
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const uploadRes = await axios.post(
          `${BASE_URL}/upload/profile-photo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );

        finalPhotoURL = uploadRes.data?.photoURL;

        if (!finalPhotoURL) {
          throw new Error("Photo upload did not return a valid URL.");
        }
      }

      // 2. Update user profile
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName,
          lastName,
          photoURL: finalPhotoURL,
          about,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      console.log(res);

      if (res.status === 200) {
        const updatedUser = res.data.data || res.data.user;
        dispatch(addUser(updatedUser));

        setPhotoURL(finalPhotoURL);
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
        }
        setPhotoFile(null);
        setPhotoPreview("");

        const input = document.getElementById("profile-photo-upload");
        if (input) input.value = "";

        setMessage({
          type: "success",
          text: "Profile saved successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: res.data.message || "Unable to update profile.",
        });
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhotoURL(user?.photoURL ?? "");
    setAbout(user?.about ?? "");
    setSkills(
      Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : (user?.skills ?? ""),
    );

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview("");

    const input = document.getElementById("profile-photo-upload");
    if (input) input.value = "";

    setMessage({ type: "", text: "" });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-200";

  const fullName = `${firstName} ${lastName}`.trim() || "Your Name";

  const skillList = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const displayPhoto = photoPreview || photoURL;

  return (
    <main className="min-h-screen bg-[#080b16] px-4 py-8 text-slate-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30">
              <UserRound size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Edit Profile
              </h1>
              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage your personal information and skills.
              </p>
            </div>
          </div>
        </header>

        {/* Success / Error Notification */}

        {message.text && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${
              message.type === "success"
                ? "border-emerald-400/30 bg-emerald-950/95 text-emerald-300 shadow-emerald-950/40"
                : "border-red-400/30 bg-red-950/95 text-red-300 shadow-red-950/40"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={22} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={22} className="shrink-0 text-red-400" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {message.type === "success"
                  ? "Success!"
                  : "Something went wrong"}
              </p>
              <p className="mt-0.5 text-sm opacity-90">{message.text}</p>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Profile Preview */}
          <aside className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111625] shadow-xl shadow-black/20">
            <div className="relative h-28 overflow-hidden bg-gradient-to-r from-violet-900 via-indigo-800 to-blue-900">
              <div className="absolute -right-8 -top-16 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
            </div>

            <div className="px-6 pb-6">
              <div className="-mt-14 mb-4 flex justify-center">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 p-1 shadow-lg shadow-violet-900/30">
                    {displayPhoto ? (
                      <img
                        src={displayPhoto}
                        alt={fullName}
                        className="h-28 w-28 rounded-full border-4 border-[#111625] bg-slate-900 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#111625] bg-slate-900 text-3xl font-bold text-violet-300">
                        {initials}
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="profile-photo-upload"
                    className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#111625] bg-violet-600 text-white shadow-lg transition hover:bg-violet-500"
                    title="Change profile photo"
                  >
                    <Camera size={15} />
                  </label>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{fullName}</h2>

                <p className="mt-1 text-sm text-slate-400">
                  {user?.headline || "Full Stack Developer"}
                </p>
              </div>

              <div className="my-6 border-t border-slate-800" />

              <div className="space-y-5">
                {/* First Name */}
                <div className="flex gap-3">
                  <UserRound
                    size={19}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      First Name
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-200">
                      {firstName || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex gap-3">
                  <UserRound
                    size={19}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Last Name
                    </p>
                    <p className="mt-1 break-words text-sm font-medium text-slate-200">
                      {lastName || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* About */}
                <div className="flex gap-3">
                  <FileText
                    size={19}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">About</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                      {about || "Tell people something about yourself."}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex gap-3">
                  <Code2
                    size={19}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-400">Skills</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {skillList.length > 0 ? (
                        skillList.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-lg border border-violet-500/20 bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-300"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Edit Form */}
          <section className="rounded-2xl border border-slate-800 bg-[#111625] p-5 shadow-xl shadow-black/20 sm:p-8">
            <div className="mb-7">
              <h2 className="text-lg font-bold text-white">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Make changes to your profile information below.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* First and Last Name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    autoComplete="given-name"
                    className={inputClass}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    autoComplete="family-name"
                    className={inputClass}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Profile Photo Uploader */}
              <div>
                <label className={labelClass}>Profile Photo</label>

                <div className="mt-2 flex flex-col items-center gap-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 sm:flex-row">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-violet-500/30 bg-slate-950 shadow-md">
                    {displayPhoto ? (
                      <img
                        src={displayPhoto}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-violet-300">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="font-semibold text-white">
                      {photoFile
                        ? "New photo ready to upload"
                        : "Upload your profile photo"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG, or WEBP up to 5 MB.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20">
                        <Upload size={15} />
                        {displayPhoto ? "Choose New Photo" : "Choose Photo"}

                        <input
                          id="profile-photo-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>

                      {photoFile && (
                        <button
                          type="button"
                          onClick={handleRemoveSelectedPhoto}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <X size={14} />
                          Cancel Selection
                        </button>
                      )}
                    </div>

                    {photoFile && (
                      <p className="mt-2 truncate text-xs font-medium text-emerald-400">
                        ✓ {photoFile.name} ({(photoFile.size / 1024).toFixed(0)} KB)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    className="text-sm font-semibold text-slate-200"
                    htmlFor="about"
                  >
                    About
                  </label>

                  <span className="text-xs text-slate-500">
                    {about.length}/500
                  </span>
                </div>

                <textarea
                  id="about"
                  className={`${inputClass} min-h-32 resize-y`}
                  placeholder="Tell us a little about yourself..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  maxLength={500}
                  rows={4}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Share your experience, interests, and what you do.
                </p>
              </div>

              {/* Skills */}
              <div>
                <label className={labelClass} htmlFor="skills">
                  Skills
                </label>

                <div className="relative">
                  <Code2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="skills"
                    className={`${inputClass} pl-11`}
                    placeholder="React, Node.js, MongoDB"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Separate each skill with a comma.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset Changes
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-700/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}

                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Footer Tip */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Lightbulb size={20} />
          </div>

          <p className="text-sm leading-6 text-slate-400">
            <span className="font-semibold text-violet-300">Pro tip:</span> Keep
            your profile up to date so people can learn more about you and your
            skills.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
