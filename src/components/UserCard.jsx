import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { isRequestSucess } from "../utils/userSlice";
import { removeFeedUser } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoURL, about } = user;

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const dispatch = useDispatch();

  const handleConnections = async (status) => {
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${user._id}`,
        {},
        { withCredentials: true },
      );

      if (res.status === 200 && status === "interested") {
        setMessage({
          text: "Connection request sent successfully!",
          type: "success",
        });

        dispatch(isRequestSucess(true));
        dispatch(removeFeedUser(user._id));
      } else if (res.status === 200 && status === "ignored") {
        setMessage({
          text: "Profile ignored successfully.",
          type: "success",
        });

        dispatch(removeFeedUser(user._id));
      }
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto w-full">
      <article className="grid h-full min-h-[440px] w-full grid-cols-1 overflow-hidden rounded-3xl border border-[#292936] bg-[#0d0d12] text-white shadow-xl shadow-black/20 transition duration-300 hover:border-[#454555] md:grid-cols-[1fr_0.9fr]">
        {/* Profile Photo */}
        <div className="relative min-h-[280px] overflow-hidden bg-[#1b1b27] sm:min-h-[340px] md:min-h-[440px]">
          {photoURL ? (
            <img
              src={photoURL}
              alt={`${firstName}'s profile`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,#242433_0px,#242433_20px,#1b1b28_20px,#1b1b28_40px)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl font-bold text-white/60">
                {firstName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

          {/* Interests Count */}
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {user.skills?.length || 0} interests
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex min-w-0 flex-col border-t border-white/10 bg-gradient-to-b from-[#111117] to-[#0c0c11] p-4 sm:p-5 md:border-l md:border-t-0 md:p-5 lg:p-6">
          {/* Name and Age */}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="break-words text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {firstName}
              {lastName ? `, ${lastName}` : ""}
              {user.age ? `, ${user.age}` : ""}
            </h2>

            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff684f] text-black"
              aria-label="Profile badge"
              title="Profile badge"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-3.5 w-3.5"
              >
                <path
                  d="m6 12 4 4 8-8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* About */}
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[#9292a3]">
              About
            </p>

            <p className="break-words text-sm leading-5 text-[#e0e0e8] [overflow-wrap:anywhere]">
              {about || "This user hasn't added an about section yet."}
            </p>
          </div>

          {/* Interests */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-[#9292a3]">
              Interests
            </p>

            {user.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="max-w-full break-words rounded-full border border-[#30303d] bg-white/[0.02] px-2.5 py-1.5 text-xs font-medium text-[#eeeeF4] transition hover:border-[#555568] sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}

                {user.skills.length > 4 && (
                  <span className="rounded-full border border-[#30303d] px-2.5 py-1.5 text-xs text-[#a5a5b5]">
                    +{user.skills.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#777787]">No interests added yet.</p>
            )}
          </div>

          {/* Pass and Like */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
            <button
              type="button"
              onClick={() => handleConnections("ignored")}
              aria-label="Pass on profile"
              title="Pass"
              className="flex h-12 items-center justify-center rounded-full border-2 border-[#ff4d59] text-[#ff4d59] transition duration-200 hover:bg-[#ff4d59]/10 active:scale-95 sm:h-14"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-6 w-6 sm:h-7 sm:w-7"
              >
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
              <span className="ml-2 text-sm font-semibold">Pass</span>
            </button>

            <button
              type="button"
              onClick={() => handleConnections("interested")}
              aria-label="Like and connect"
              title="Like"
              className="flex h-12 items-center justify-center rounded-full bg-[#31d6a0] text-[#07130e] shadow-lg shadow-emerald-400/10 transition duration-200 hover:bg-[#48e4b1] active:scale-95 sm:h-14"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-6 w-6 sm:h-7 sm:w-7"
              >
                <path
                  d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold">Like</span>
            </button>
          </div>

          {/* Feedback */}
          {message.text && (
            <div
              role={message.type === "error" ? "alert" : "status"}
              className={`mt-3 rounded-xl border px-3 py-2 text-center text-xs ${
                message.type === "error"
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
