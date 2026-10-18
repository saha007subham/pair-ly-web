const UserCard = ({ user }) => {
  //   console.log(user);
  const { firstName, lastName, photoURL, about } = user;
  return (
    <div className="card bg-base-100 w-full max-w-sm overflow-hidden rounded-2xl border border-base-300 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Cover */}
      <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500">
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="card-body gap-4 p-5 pt-0">
        {/* Profile image */}
        <div className="-mt-14 flex items-end justify-between">
          <div className="avatar">
            <div className="h-24 w-24 rounded-2xl border-4 border-base-100 bg-base-200 shadow-md">
              <img
                src={photoURL || "/default-avatar.png"}
                alt={firstName}
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="badge badge-success badge-outline gap-1 mb-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            Member
          </div>
        </div>

        {/* Name and details */}
        <div className="space-y-1">
          <h2 className="card-title text-xl font-bold tracking-tight">
            {`${firstName} ${lastName}`}
          </h2>

          {user?.age && user?.gender && (
            <p className="text-sm text-base-content/60">
              {user.age} years · {user.gender}
            </p>
          )}
        </div>

        {/* Bio */}
        <p className="min-h-12 text-sm leading-6 text-base-content/70 line-clamp-3">
          {about || "This user hasn't added a bio yet."}
        </p>

        {/* Skills / interests */}
        {user?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="badge badge-ghost rounded-lg px-3 py-3"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="badge badge-outline rounded-lg px-3 py-3">
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions mt-1 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3">
          <button className="btn rounded-xl border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18 6-12 12M6 6l12 12"
              />
            </svg>
            Ignore
          </button>
          <button className="btn rounded-xl border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-3v6m-3-3h6"
              />
            </svg>
            Connect
          </button>

          <button
            className="btn btn-square btn-outline rounded-xl"
            aria-label={`View ${firstName}'s profile`}
            title="View profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
