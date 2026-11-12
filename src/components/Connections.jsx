import axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorState from "./ErrorState";
import { getErrorMessage } from "../utils/getErrorMessage";
import { BASE_URL } from "../utils/constants";
import ProfileImage from "./ProfileImage";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { parseSkills } from "../utils/parseSkills";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const [loadError, setLoadError] = useState("");

  const fetchConnections = async () => {
    setLoadError("");
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data ?? []));
    } catch (err) {
      console.error(err);
      setLoadError(getErrorMessage(err, "Couldn't load your connections."));
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections && loadError)
    return <ErrorState title="Couldn't load connections" message={loadError} onRetry={fetchConnections} />;

  if (!connections)
    return (
      <div className="flex justify-center my-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (connections.length == 0)
    return (
      <div className="text-center my-20 px-4">
        <p className="text-6xl mb-4">🤝</p>
        <h1 className="text-2xl font-bold">No connections yet</h1>
        <p className="mt-2 text-base-content/60">Head to the feed and show some interest!</p>
        <Link to="/" className="btn btn-primary mt-6">Browse developers</Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Connections</h1>
        <p className="text-base-content/60 mt-1">{connections.length} {connections.length === 1 ? "developer" : "developers"} you're connected with</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {connections.map((connection) => {
          const {
            _id,
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
            skills,
          } = connection;
          const skillList = parseSkills(skills);

          return (
            <div
              key={_id}
              className="surface-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition hover:shadow-md"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <ProfileImage
                  photoUrl={photoUrl}
                  firstName={firstName}
                  lastName={lastName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0 ring-2 ring-primary/30"
                  textClass="text-xl sm:text-2xl"
                />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold break-words">
                    {firstName + " " + lastName}
                    {age && gender && (
                      <span className="ml-2 text-sm font-normal text-base-content/60 capitalize">{`${age}, ${gender}`}</span>
                    )}
                  </h3>
                  {about && <p className="text-base-content/70 mt-1 text-sm line-clamp-2 break-words">{about}</p>}
                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skillList.map((s) => (
                        <span key={s} className="badge badge-primary badge-outline badge-sm">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="tooltip tooltip-top w-full sm:w-auto" data-tip={`Message ${firstName}`}>
                <Link to={"/chat/" + _id} className="btn btn-primary w-full sm:w-auto">
                  💬 Chat
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
