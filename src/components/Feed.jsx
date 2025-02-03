import axios from "axios";
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  console.log(feed);

  const getFeed = async () => {
    if(feed) return;
    try{
      const res = await axios.get(BASE_URL + "/user/feed", { withCredentials: true });
      if (res?.data?.data) {
        dispatch(addFeed(res.data.data));
      } else {
        console.error("No data found in the response");
      }
    }
    catch(err){
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if(!feed) return;

  if(feed.length <= 0) return <h1 className="flex justify-center my-10">No new users found!!</h1>

  return feed && (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]}/>
    </div>
  )
}

export default Feed;





