import React, { useState } from 'react';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorAlert from './ErrorAlert';

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorMessage = (err) => {
    console.error(err);
    const fallback = isLoginForm
      ? "Couldn't log you in. Please try again."
      : "Couldn't create your account. Please try again.";
    return getErrorMessage(err, fallback);
  };

  const handleLogin = async () => {
    setLoading(true);
    try{
      const res = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
      dispatch(removeUser()); // clear any data cached from a previous session
      dispatch(addUser(res.data));
      return navigate("/");
    }
    catch(err){
      setError(errorMessage(err));
    }
    finally{
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try{
      const res = await axios.post(BASE_URL + "/signup",
        { firstName, lastName, emailId, password }, { withCredentials: true }
      );

      dispatch(removeUser());
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    }
    catch(err){
      setError(errorMessage(err));
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="surface-card w-full max-w-4xl grid md:grid-cols-2 overflow-hidden shadow-xl">
        <div className="brand-gradient text-primary-content p-8 md:p-10 flex flex-col justify-center gap-4">
          <p className="text-5xl">🧑‍💻</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Find your next dev collaborator</h1>
          <p className="text-white/85">
            Swipe through developers, share skills and start building together.
          </p>
          <ul className="hidden md:block space-y-1 text-white/90 text-sm mt-2">
            <li>✓ Discover developers by skills</li>
            <li>✓ Send and receive connection requests</li>
            <li>✓ Chat in real time</li>
          </ul>
        </div>

        <form
          className="p-6 sm:p-8 md:p-10"
          onSubmit={(e) => { e.preventDefault(); isLoginForm ? handleLogin() : handleSignUp(); }}
        >
          <h2 className="text-2xl font-bold">{isLoginForm ? "Welcome back" : "Create your account" }</h2>
          <p className="text-sm text-base-content/60 mt-1 mb-4">
            {isLoginForm ? "Log in to keep connecting." : "It only takes a minute."}
          </p>

          { !isLoginForm &&  (
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control">
                <div className="label pb-1"><span className="label-text font-medium">First name</span></div>
                <input type="text" value={firstName} required
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control">
                <div className="label pb-1"><span className="label-text font-medium">Last name</span></div>
                <input type="text" value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          ) }
          <label className="form-control mt-2">
            <div className="label pb-1"><span className="label-text font-medium">Email</span></div>
            <input type="email" autoComplete="email" placeholder="you@example.com" value={emailId} required
              className="input input-bordered w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>
          <label className="form-control mt-2">
            <div className="label pb-1"><span className="label-text font-medium">Password</span></div>
            <input type="password" autoComplete={isLoginForm ? "current-password" : "new-password"} value={password} required
              className="input input-bordered w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <ErrorAlert message={error} onDismiss={() => setError("")} className="mt-4" />

          <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {isLoginForm ?  "Login" : "Sign Up"}
          </button>
          <p className="text-center text-sm mt-4 text-base-content/70">
            {isLoginForm ? "New to DevTinder? " : "Already have an account? "}
            <button
              type="button"
              className="link link-primary font-medium inline-block py-2 px-1"
              onClick={() => { setError(""); setIsLoginForm((value) => !value); }}
            >
              {isLoginForm ? "Sign up" : "Log in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
