import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length == 0)
    return (
      <h1 className="flex justify-center my-10"> No Connections Found </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="text-white text-4xl mb-8">Connections</h1>
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

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 mb-6 rounded-2xl bg-base-300 w-full max-w-4xl mx-auto shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="flex items-center gap-6 text-left">
              <img
                alt="profile"
                className="w-24 h-24 rounded-full border-1 shadow-md object-cover"
                src={photoUrl}
              />
              <div>
                <h3 className="text-xl text-white">
                  {firstName + " " + lastName}
                </h3>
                {age && gender && (
                  <p className="text-sm mt-1 text-gray-300">{`${age}, ${gender}`}</p>
                )}
                <p className="text-gray-200 mt-1">{about}</p>
                <p className="text-sm text-blue-200 mt-2">{skills}</p>
              </div>
            </div>

            <Link to={"/chat/" + _id}>
              <button className="btn btn-secondary bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 text-xl rounded-xl">
                Chat
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;




