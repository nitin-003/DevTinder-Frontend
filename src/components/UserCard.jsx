import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import ProfileImage from "./ProfileImage";
import ErrorAlert from "./ErrorAlert";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { parseSkills } from "../utils/parseSkills";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const skillList = parseSkills(skills);

  const handleSendRequest = async (status, userId) => {
    setSending(true);
    setError("");
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));
    }
    catch (err){
      console.error(err);
      setError(getErrorMessage(err, "Couldn't send that. Please try again."));
    }
    finally {
      setSending(false);
    }
  };

  return (
    <div className="surface-card overflow-hidden w-full max-w-sm shadow-xl">
        <div className="relative h-[clamp(16rem,46vh,26rem)] bg-base-300">
            <ProfileImage
              photoUrl={photoUrl}
              firstName={firstName}
              lastName={lastName}
              className="absolute inset-0 w-full h-full"
              textClass="text-8xl" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16 text-white">
                <h2 className="text-2xl font-bold leading-tight break-words">
                  {firstName} {lastName}
                  {age && <span className="font-normal text-white/80">, {age}</span>}
                </h2>
                {gender && <p className="text-sm capitalize text-white/80">{gender}</p>}
            </div>
        </div>
        <div className="p-5 space-y-3">
            <p className="text-base-content/80 break-words">{about || "No bio yet."}</p>
            {skillList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill) => (
                  <span key={skill} className="badge badge-primary badge-outline">{skill}</span>
                ))}
              </div>
            )}
            <ErrorAlert message={error} onDismiss={() => setError("")} />
            {showActions && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="tooltip tooltip-top w-full" data-tip="Skip this person">
                    <button className="btn btn-outline w-full" disabled={sending} onClick={() => handleSendRequest("ignored", _id)}>✕ Ignore</button>
                  </div>
                  <div className="tooltip tooltip-top w-full" data-tip="Send a request">
                    <button className="btn btn-primary w-full" disabled={sending} onClick={() => handleSendRequest("interested", _id)}>♥ Interested</button>
                  </div>
              </div>
            )}
        </div>
    </div>
  );
};

export default UserCard;
