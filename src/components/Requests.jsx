import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [showButtons, setShowButtons] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        `${BASE_URL}/request/review/${status.toLowerCase()}/${_id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length == 0)
    return <h1 className="flex justify-center my-10"> No Requests Found </h1>;

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>
      {requests.map((request) => {
        const {
          _id,
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills,
        } = request.fromUserId;

        return (
          <div
            key={_id}
            className="flex flex-col md:flex-row items-center justify-between bg-base-300 text-white p-6 m-4 rounded-2xl w-full max-w-5xl mx-auto shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Left: Profile Image and Info */}
            <div className="flex items-center w-full md:w-3/4">
              <img
                alt="profile"
                src={photoUrl}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="text-left ml-6">
                <h3 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h3>
                {age && gender && (
                  <p className="text-sm mt-1">
                    {age}, {gender}
                  </p>
                )}
                <p className="text-sm mt-2">{about}</p>
                <p className="text-sm mt-1 text-blue-200">{skills}</p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="mt-4 md:mt-0 md:w-1/4 flex justify-center md:justify-end gap-4">
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl"
                onClick={() => reviewRequest("Rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-primary bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl"
                onClick={() => reviewRequest("Accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;





