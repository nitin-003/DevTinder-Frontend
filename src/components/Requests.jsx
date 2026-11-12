import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import ProfileImage from "./ProfileImage";
import ErrorAlert from "./ErrorAlert";
import ErrorState from "./ErrorState";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { parseSkills } from "../utils/parseSkills";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState("");

  const reviewRequest = async (status, _id) => {
    setPendingId(_id);
    setError("");
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status.toLowerCase()}/${_id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Couldn't update that request. Please try again."));
    } finally {
      setPendingId(null);
    }
  };

  const [loadError, setLoadError] = useState("");

  const fetchRequests = async () => {
    setLoadError("");
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data ?? []));
    } catch (err) {
      console.error(err);
      setLoadError(getErrorMessage(err, "Couldn't load your requests."));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests && loadError)
    return <ErrorState title="Couldn't load requests" message={loadError} onRetry={fetchRequests} />;

  if (!requests)
    return (
      <div className="flex justify-center my-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (requests.length == 0)
    return (
      <div className="text-center my-20 px-4">
        <p className="text-6xl mb-4">📭</p>
        <h1 className="text-2xl font-bold">No pending requests</h1>
        <p className="mt-2 text-base-content/60">New connection requests will show up here.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Connection requests</h1>
        <p className="text-base-content/60 mt-1">{requests.length} {requests.length === 1 ? "person wants" : "people want"} to connect with you</p>
      </div>
      <ErrorAlert message={error} onDismiss={() => setError("")} className="mb-4" />
      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => {
          const {
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
            skills,
          } = request.fromUserId;
          const skillList = parseSkills(skills);
          const busy = pendingId === request._id;

          return (
            <div
              key={request._id}
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
                      <span className="ml-2 text-sm font-normal text-base-content/60 capitalize">{age}, {gender}</span>
                    )}
                  </h3>
                  {about && <p className="text-sm mt-1 text-base-content/70 line-clamp-2 break-words">{about}</p>}
                  {skillList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skillList.map((s) => (
                        <span key={s} className="badge badge-primary badge-outline badge-sm">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex gap-3">
                <div className="tooltip tooltip-top w-full sm:w-auto" data-tip={`Decline ${firstName}'s request`}>
                  <button
                    className="btn btn-outline w-full"
                    disabled={busy}
                    onClick={() => reviewRequest("Rejected", request._id)}
                  >
                    Reject
                  </button>
                </div>
                <div className="tooltip tooltip-top w-full sm:w-auto" data-tip={`Connect with ${firstName}`}>
                  <button
                    className="btn btn-primary w-full"
                    disabled={busy}
                    onClick={() => reviewRequest("Accepted", request._id)}
                  >
                    {busy && <span className="loading loading-spinner loading-xs"></span>}
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
