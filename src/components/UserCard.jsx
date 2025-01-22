import React from 'react'

const UserCard = ({user}) => {
    const { firstName, lastName, photoUrl, age, gender, about } = user;
    return (
        <div className="card bg-base-300 w-96 shadow-xl">
            <figure>
                <img src={user.photoUrl}
                    // src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="photo" />
            </figure>
            <div className="card-body">
                <h2 className="card-title justify-center">{firstName + " " + lastName}</h2>
                { age && gender && <p>{age + ", " + gender}</p> }
                <p className="justify-center">{about}</p>
                <div className="card-actions justify-center my-4">
                    <button className="btn btn-primary">Ignore</button>
                    <button className="btn btn-secondary">Interested</button>
                </div>
            </div>
        </div>
    )
};

export default UserCard




