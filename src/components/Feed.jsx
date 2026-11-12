import axios from "axios";
import React, { useEffect, useState } from 'react';
import ErrorState from "./ErrorState";
import { getErrorMessage } from "../utils/getErrorMessage";
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from "./UserCard";

const Feed = () => {
  const currentUser = useSelector((store) => store.user);
  const rawFeed = useSelector((store) => store.feed);
  // Never show the logged-in user their own profile
  const feed = rawFeed ? rawFeed.filter((u) => u._id !== currentUser?._id) : null;
  const dispatch = useDispatch();

  const [loadError, setLoadError] = useState("");

  const getFeed = async () => {
    if(feed) return;
    setLoadError("");
    try{
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });

      if(res?.data?.data){
        dispatch(addFeed(res?.data?.data));
      }
      else {
        console.error("No data found in the response");
        setLoadError("We got an unexpected response from the server.");
      }
    }
    catch(err){
      console.error(err);
      setLoadError(getErrorMessage(err, "Couldn't load developers right now."));
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if(!feed && loadError) return (
    <ErrorState title="Couldn't load your feed" message={loadError} onRetry={getFeed} />
  );

  if(!feed) return (
    <div className="flex justify-center my-24">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if(feed.length <= 0) return (
    <div className="text-center my-20 px-4">
      <p className="text-6xl mb-4">🎉</p>
      <h1 className="text-2xl font-bold">You're all caught up!</h1>
      <p className="mt-2 text-base-content/60">No new developers right now. Check back later.</p>
    </div>
  );

  return (
    <div className="px-4 py-8 sm:py-10">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Discover <span className="brand-text">developers</span></h1>
        <p className="text-sm text-base-content/60 mt-1">{feed.length} {feed.length === 1 ? "person" : "people"} waiting to connect</p>
      </div>
      <div className="flex justify-center">
        <UserCard user={feed[0]}/>
      </div>
    </div>
  );
};

export default Feed;
