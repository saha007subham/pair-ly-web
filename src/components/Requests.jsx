import axios from "axios";
import { useEffect, useState } from "react";
import {
  UsersRound,
  UserRound,
  Check,
  X,
  LoaderCircle,
  AlertCircle,
  Inbox,
  RefreshCw,
} from "lucide-react";

import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/user/requests/pending`, {
        withCredentials: true,
      });

      // Support either { data: [...] } or a direct array.
      const requestData = Array.isArray(res.data) ? res.data : res.data?.data;

      setRequests(Array.isArray(requestData) ? requestData : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load connection requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (requestId, status) => {
    try {
      setProcessingId(requestId);
      setMessage({ type: "", text: "" });

      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      setRequests((prev) =>
        prev.filter((request) => {
          const id =
            request._id ?? request.requestId ?? request.fromUserId?._id;

          return id !== requestId;
        }),
      );

      setMessage({
        type: "success",
        text:
          res.data?.message ||
          (status === "accepted"
            ? "Connection request accepted!"
            : "Connection request rejected."),
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Unable to process this request. Please try again.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (user) => {
    const first = user?.firstName?.charAt(0) ?? "";
    const last = user?.lastName?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <main className="min-h-screen bg-[#080b16] px-4 py-8 text-slate-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30">
              <UsersRound size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Connection Requests
              </h1>
              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage the people who want to connect with you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-800 bg-[#111625] px-4 py-3 sm:self-auto">
            <Inbox size={20} className="text-violet-400" />
            <div>
              <p className="text-xs text-slate-400">Pending requests</p>
              <p className="text-lg font-bold text-white">{requests.length}</p>
            </div>
          </div>
        </header>

        {/* Toast notification */}
        {message.text && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl ${
              message.type === "success"
                ? "border-emerald-400/30 bg-emerald-950/95 text-emerald-300"
                : "border-red-400/30 bg-red-950/95 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <Check size={20} className="shrink-0" />
            ) : (
              <AlertCircle size={20} className="shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              aria-label="Dismiss notification"
              className="ml-auto text-current opacity-70 hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm hover:bg-red-500/10 disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#111625]">
            <LoaderCircle size={32} className="animate-spin text-violet-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading connection requests...
            </p>
          </div>
        ) : error ? null : requests.length > 0 ? (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                People you may know
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Review each request to grow your network.
              </p>
            </div>

            {/* Request cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {requests.map((item, index) => {
                const sender = item.fromUserId;
                const requestId = item._id ?? item.requestId ?? sender?._id;

                const isProcessing = processingId === requestId;

                return (
                  <article
                    key={requestId ?? index}
                    className="group overflow-hidden rounded-2xl border border-slate-800 bg-[#111625] transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-950/20"
                  >
                    <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        {sender?.photoURL ? (
                          <img
                            src={sender.photoURL}
                            alt={`${sender.firstName ?? ""} ${sender.lastName ?? ""}`}
                            className="h-20 w-20 rounded-2xl border border-slate-700 object-cover shadow-lg shadow-black/20"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-violet-950/30">
                            {getInitials(sender)}
                          </div>
                        )}

                        <h3 className="mt-4 text-lg font-semibold text-white">
                          {sender?.firstName} {sender?.lastName}
                        </h3>

                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="text-xs font-medium text-amber-300">
                            Pending request
                          </span>
                        </div>
                      </div>

                      <div className="my-6 border-t border-slate-800" />

                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <UserRound
                          size={17}
                          className="shrink-0 text-violet-400"
                        />
                        <span className="truncate">
                          {sender?._id ?? "Connection request"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={isProcessing || !requestId}
                          onClick={() => handleReview(requestId, "accepted")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:from-emerald-500 hover:to-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <LoaderCircle size={17} className="animate-spin" />
                          ) : (
                            <Check size={17} />
                          )}
                          Accept
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing || !requestId}
                          onClick={() => handleReview(requestId, "rejected")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X size={17} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty state */
          <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#111625] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <UsersRound size={30} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              You're all caught up!
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              You don't have any pending connection requests right now. New
              requests will appear here.
            </p>

            <button
              type="button"
              onClick={fetchRequests}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300"
            >
              <RefreshCw size={16} />
              Refresh requests
            </button>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <UsersRound size={19} />
          </div>
          <p className="text-sm leading-6 text-slate-400">
            <span className="font-semibold text-violet-300">
              Build your network.
            </span>{" "}
            Connect with people and grow your community.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Requests;
