import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, removeUser } from '../utils/userSlice'
import axios from "axios";
import ErrorState from './ErrorState'
import { getErrorMessage } from '../utils/getErrorMessage'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const userData = useSelector((store) => store.user);
  // false until we know whether the visitor has a valid session
  const [authChecked, setAuthChecked] = useState(false);
  // set when the server can't be reached (as opposed to "not logged in")
  const [startupError, setStartupError] = useState("");

  const fetchUser = async () => {
    setStartupError("");
    if (!userData) {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
        dispatch(addUser(res.data));
      } catch (err) {
        // Any 4xx (the backend answers 400 for expired/invalid tokens) means
        // "not logged in"; only network failures and 5xx are startup errors.
        const status = err?.response?.status;
        if (!status || status >= 500) {
          console.error(err);
          setStartupError(getErrorMessage(err, "We couldn't start the app. Please try again."));
          return;
        }
      }
    }
    setAuthChecked(true);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // If the session expires while using the app, log the user out locally
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) dispatch(removeUser());
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [dispatch]);

  // Route guard: logged-out users go to /login, logged-in users skip /login
  useEffect(() => {
    if (!authChecked) return;
    if (!userData && pathname !== "/login") {
      navigate("/login", { replace: true });
    } else if (userData && pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [authChecked, userData, pathname]);

  if (startupError) {
    return <ErrorState fullScreen title="Can't connect to DevTinder" message={startupError} onRetry={fetchUser} />;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip">
      <NavBar/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default Body
