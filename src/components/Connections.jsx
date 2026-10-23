import axios from "axios";
import { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserRound,
  MessageCircle,
  ArrowUpRight,
  UsersRound,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";

import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      console.log(res);

      setConnections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your connections. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((connection) => {
    const fullName =
      `${connection.firstName ?? ""} ${connection.lastName ?? ""}`
        .trim()
        .toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      (connection.toUserId ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const getInitials = (connection) => {
    const first = connection.firstName?.charAt(0) ?? "";
    const last = connection.lastName?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <main className="min-h-screen bg-[#080b16] px-4 py-8 text-slate-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30">
              <UsersRound size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                My Connections
              </h1>

              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage your network and stay connected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-800 bg-[#111625] px-4 py-3 sm:self-auto">
            <Users size={19} className="text-violet-400" />

            <div>
              <p className="text-xs text-slate-400">Total connections</p>
              <p className="text-lg font-bold text-white">
                {connections.length}
              </p>
            </div>
          </div>
        </header>

        {/* Search and Summary */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-[#111625] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Your network</h2>

              <p className="mt-1 text-sm text-slate-400">
                People you're connected with.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search connections..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-11 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Error */}
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
              onClick={fetchConnections}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium transition hover:bg-red-500/10 disabled:opacity-50"
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
              Loading your connections...
            </p>
          </div>
        ) : error ? null : filteredConnections.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-200">
                  {filteredConnections.length}
                </span>{" "}
                {filteredConnections.length === 1
                  ? "connection"
                  : "connections"}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Connection Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredConnections.map((connection) => (
                <article
                  key={connection.toUserId}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111625] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-950/20"
                >
                  {/* Decorative accent */}
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl transition group-hover:bg-violet-500/20" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-950/30">
                        {getInitials(connection)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">
                          {connection.firstName} {connection.lastName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Connection
                        </p>
                      </div>
                    </div>

                    <span
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10"
                      title="Connected"
                    />
                  </div>

                  <div className="my-5 border-t border-slate-800" />

                  <div className="mb-5 flex items-start gap-3">
                    <UserRound
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">User ID</p>

                      <p
                        className="mt-1 truncate font-mono text-xs text-slate-300"
                        title={connection.toUserId}
                      >
                        {connection.toUserId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard
                          ?.writeText(connection.toUserId)
                          .catch(() => {});
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      <UserRound size={16} />
                      Copy ID
                    </button>

                    <button
                      type="button"
                      disabled
                      title="Messaging is not connected to this API yet"
                      className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 text-sm font-semibold text-white opacity-60"
                    >
                      <MessageCircle size={16} />
                      Message
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-[#111625] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              {search ? <Search size={28} /> : <UsersRound size={28} />}
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              {search ? "No connections found" : "No connections yet"}
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              {search
                ? "Try searching with a different name or user ID."
                : "Your connections will appear here when you connect with other people."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Clear search
              </button>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <UsersRound size={19} />
          </div>

          <p className="text-sm leading-6 text-slate-400">
            <span className="font-semibold text-violet-300">Your network,</span>{" "}
            all in one place. Keep building meaningful connections.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Connections;
