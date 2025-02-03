import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addRequests, removeRequest } from '../utils/requestSlice';

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const [showButtons, setShowButtons] = useState(true);

    const reviewRequest = async (status, _id) => {
        try{
            // const res = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {withCredentials: true});
            const res = axios.post(`${BASE_URL}/request/review/${status.toLowerCase()}/${_id}`, {}, {withCredentials: true});

            dispatch(removeRequest(_id));
        }
        catch(err){
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true });
            dispatch(addRequests(res?.data?.data));
        }
        catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if(!requests) return;
    if(requests.length == 0) return <h1 className="flex justify-center my-10"> No Requests Found </h1>

    return (
        <div className="text-center my-10">
            <h1 className="text-bold text-white text-3xl">Connection Requests</h1>
            {requests.map((request) => {
                const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;

                return (
                    <div key={_id} className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-full mx-auto">
                        <div><img alt="photo" className='w-20 h-20 rounded-full' src={photoUrl}/></div>
                        <div className="text-left mx-4">
                            <h3 className="font-bold text-xl">{firstName + " " + lastName}</h3>
                            {age && gender && <p>{age + ", " + gender}</p>}
                            <p>{about}</p>
                            <p>{skills}</p>
                        </div> 
                        <div>
                            <button className="btn btn-primary mx-2 my-1" onClick={() => reviewRequest("Rejected", request._id)}>Reject</button>
                            <button className="btn btn-secondary mx-2my-1" onClick={() => reviewRequest("Accepted", request._id)}>Accept</button>
                        </div> 
                    </div>
                )
            })}
        </div>
    );
};

export default Requests





