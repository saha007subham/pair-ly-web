import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addFeed, appendFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { isRequestSucess } from "../utils/userSlice";

const PAGE_LIMIT = 4; // Number of users fetched per page

const Feed = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const isFetchingRef = useRef(false);
  const observerTarget = useRef(null);

  const disPatch = useDispatch();
  const navigate = useNavigate();

  const feed = useSelector((store) => store.feed);
  const success = useSelector((store) => store.user?.isRequestSucess);

  const fetchFeed = async (pageNum = 1, isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isInitial || pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError("");

    try {
      const res = await axios.get(
        `${BASE_URL}/feed?page=${pageNum}&limit=${PAGE_LIMIT}`,
        {
          withCredentials: true,
        },
      );

      const newUsers = res?.data?.users || [];

      if (isInitial || pageNum === 1) {
        disPatch(addFeed(newUsers));
      } else {
        disPatch(appendFeed(newUsers));
      }

      // If backend returns fewer than PAGE_LIMIT, we've reached the end
      if (newUsers.length < PAGE_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.status == 401) {
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load feed.");
      }
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchFeed(1, true);
  };

  useEffect(() => {
    if (!feed) {
      fetchFeed(1, true);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore || isFetchingRef.current) return;

    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchFeed(nextPage, false);
      return nextPage;
    });
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !loadingMore &&
          !isFetchingRef.current
        ) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "250px", // Trigger before user reaches the bottom
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadMore, hasMore, loading, loadingMore]);

  useEffect(() => {
    if (!success) return;

    let timer = setTimeout(() => {
      disPatch(isRequestSucess(false));
    }, 3000);

    return () => clearTimeout(timer);
  }, [success, disPatch]);

  return (
    <main className="min-h-screen bg-base-200/50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {success && (
          <div className="toast toast-top toast-center z-[100] px-4 pt-4">
            <div
              role="status"
              aria-live="polite"
              className="alert alert-success flex w-full max-w-sm gap-3 rounded-xl border border-success/20 shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              <span className="flex-1 text-sm font-medium">
                Connection request sent successfully!
              </span>

              <button
                type="button"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Dismiss notification"
                onClick={() => disPatch(isRequestSucess(false))}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 border-b border-base-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Discover people
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Find your <span className="text-primary">people.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
              Meet new people, explore their profiles, and build meaningful
              connections with your community.
            </p>
          </div>

          {Array.isArray(feed) && feed.length > 0 && (
            <div className="flex w-fit items-center gap-2 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.196-2.045M17 20H7m10 0v-2c0-.728-.195-1.411-.536-2M7 20H2v-2a3 3 0 015.196-2.045M7 20v-2c0-.728.195-1.411.536-2m0 0a5 5 0 019.928 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">{feed.length}</p>
                <p className="text-xs text-base-content/60">
                  {feed.length === 1 ? "Person loaded" : "People loaded"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Initial Loading */}
        {loading && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-3xl border border-base-300 bg-base-100/70">
            <span className="loading loading-spinner loading-lg text-primary" />
            <div className="text-center">
              <h2 className="font-semibold">Finding your people</h2>
              <p className="mt-1 text-sm text-base-content/50">
                Discovering profiles for you...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-error/20 bg-base-100 px-6 py-12 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-2xl text-error">
              !
            </div>

            <h2 className="text-xl font-bold">Oops! Something went wrong</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/60">
              {error}
            </p>

            <button
              onClick={handleRefresh}
              className="btn btn-primary mt-6 rounded-xl px-6 shadow-md shadow-primary/20"
            >
              Try again
            </button>
          </div>
        )}

        {/* User Grid */}
        {!loading && !error && Array.isArray(feed) && feed.length > 0 && (
          <>
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-2">
              {feed.map((user) => (
                <div key={user._id} className="min-w-0">
                  <UserCard user={user} />
                </div>
              ))}
            </div>

            {/* Sentinel for IntersectionObserver */}
            <div ref={observerTarget} className="h-6 w-full" />

            {/* Loading more spinner */}
            {loadingMore && (
              <div className="mt-8 flex justify-center py-6">
                <div className="flex items-center gap-3 rounded-full bg-base-100 px-5 py-2.5 shadow-sm border border-base-300">
                  <span className="loading loading-spinner loading-md text-primary" />
                  <span className="text-sm font-medium text-base-content/70">
                    Loading more people...
                  </span>
                </div>
              </div>
            )}

            {/* End of feed message */}
            {!hasMore && !loadingMore && (
              <div className="mt-12 text-center border-t border-base-300 pt-8 pb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-base-100 border border-base-300 px-4 py-2 text-xs font-medium text-base-content/60 shadow-sm">
                  <span>✨</span>
                  <span>You've seen all available profiles for now</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && Array.isArray(feed) && feed.length === 0 && (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-base-300 bg-base-100 px-6 py-12 text-center shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m6-10a4 4 0 100-8 4 4 0 000 8zm10-3v6m-3-3h6"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              No people to discover yet
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-base-content/60">
              Looks a little quiet here. Check back later to discover new
              profiles and make meaningful connections.
            </p>

            <button
              onClick={handleRefresh}
              className="btn btn-primary mt-6 rounded-xl px-6"
            >
              Refresh feed
            </button>
          </div>
        )}

        {/* Initial state placeholder before feed array is initialized */}
        {!loading && !error && feed == null && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-base-300 bg-base-100/70">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-base-content/60">Loading your feed...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
