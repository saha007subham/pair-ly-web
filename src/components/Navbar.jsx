import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user?.user);

  const handleLogut = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        navigate("/login");
        dispatch(removeUser());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-8">
      {/* Logo */}
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl font-bold">
          👩‍❤️‍👨 pair-ly
        </Link>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="hidden sm:block text-sm font-medium">
              Welcome, {user.firstName}!
            </span>

            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                type="button"
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open user menu"
              >
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    alt="User avatar"
                    src={user.photoURL || "/default-avatar.png"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                </div>
              </button>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-300"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge badge-primary">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Friends</Link>
                </li>
                <li>
                  <Link to="/requests">Pending Requests</Link>
                </li>
                <li>
                  <Link onClick={handleLogut}>Logout</Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
