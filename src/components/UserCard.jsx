import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({user}) => {
    const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        try{
            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, { withCredentials: true });
            dispatch(removeUserFromFeed(userId));
        }
        catch(err){
            console.error(err);
        }
    };

    return (
        <div className="card bg-base-300 w-96 shadow-xl">
            <figure>
                <img src={user.photoUrl}
                alt="photo" />
            </figure>
            <div className="card-body">
                <h2 className="card-title justify-center">{firstName + " " + lastName}</h2>
                { age && gender && <p className="my-10">{age + ", " + gender}</p> }
                <p className="justify-center">{about}</p>
                <p className="justify-center">{skills}</p>
                <div className="card-actions justify-center my-4">
                    <button className="btn btn-primary justify-between" onClick={() => handleSendRequest("ignored", _id)}>Ignore</button>
                    <button className="btn btn-secondary mx-2" onClick={() => handleSendRequest("interested", _id)}>Interested</button>
                </div>
            </div>
        </div>
    )
};

export default UserCard



