import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from '../utils/constants';
import ProfileImage from './ProfileImage';
import { removeUser } from '../utils/userSlice';
import { addRequests } from '../utils/requestSlice';
import ThemeToggle from './ThemeToggle';

const navLinkClass = ({ isActive }) =>
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors " +
  (isActive ? "bg-primary/10 text-primary" : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content");

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requestCount = requests?.length || 0;

  // Load pending requests as soon as the user is logged in, so the badge
  // shows without having to open the Requests page first.
  useEffect(() => {
    if (!user || requests) return;
    axios
      .get(BASE_URL + "/user/requests/received", { withCredentials: true })
      .then((res) => dispatch(addRequests(res?.data?.data ?? [])))
      .catch((err) => console.error(err));
  }, [user, requests, dispatch]);

  const handleLogout = async () => {
    try{
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-base-content/10 bg-base-100/80 backdrop-blur">
      <div className="navbar w-full px-4 sm:px-8 min-h-16">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="text-2xl">🧑‍💻</span>
            <span className="brand-text">DevTinder</span>
          </Link>
        </div>

        {user && (
          <nav className="hidden md:flex items-center gap-1 mr-3">
            <NavLink to="/" end className={navLinkClass}>Discover</NavLink>
            <NavLink to="/connections" className={navLinkClass}>Connections</NavLink>
            <NavLink to="/requests" className={navLinkClass}>
              Requests
              {requestCount > 0 && (
                <span className="tooltip tooltip-bottom ml-2" data-tip={`${requestCount} pending ${requestCount === 1 ? "request" : "requests"}`}>
                  <span className="badge badge-primary badge-sm">{requestCount}</span>
                </span>
              )}
            </NavLink>
          </nav>
        )}

        <div className="flex-none flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-full border border-base-content/10 bg-base-200 p-1 sm:pr-3 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                <ProfileImage
                  photoUrl={user.photoUrl}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  className="w-8 h-8 rounded-full"
                  textClass="text-xs"
                />
                <span className="hidden sm:block text-sm font-medium max-w-[8rem] truncate">{user.firstName}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block w-3.5 h-3.5 text-base-content/60" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 border border-base-content/10 rounded-box z-[1] mt-3 w-56 p-2 shadow-xl">
                <li className="menu-title normal-case">Hi, {user.firstName}</li>
                <li><Link to="/">Discover</Link></li>
                <li><Link to="/profile">My profile</Link></li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests" className="justify-between">
                    Requests
                    {requestCount > 0 && <span className="badge badge-primary badge-sm">{requestCount}</span>}
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout} className="text-error">Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
