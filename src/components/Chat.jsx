import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector(store => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
            withCredentials: true
        });

        const chatMessages = chat?.data?.messages.map((msg) => {
            const { senderId, text, createdAt, seen } = msg;
            return {
                firstName: senderId?.firstName,
                lastName: senderId?.lastName,
                text,
                timestamp: createdAt,
                seen
            };
        });
        setMessages(chatMessages);
    };

    useEffect(() => {
        fetchChatMessages();
    }, []);

    useEffect(() => {
        if (!user) return;

        const socket = createSocketConnection();
        socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });

        socket.on("messageReceived", ({ firstName, lastName, text, timestamp, seen }) => {
            setMessages(messages => [...messages, { firstName, lastName, text, timestamp, seen }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId]);

    const sendMessage = () => {
        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: newMessage
        });
        setNewMessage("");
    };

    return (
        <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
            <h1 className="p-5 border-b border-gray-600">Chat</h1>
            <div className="flex-1 overflow-scroll p-5">
                {messages.map((msg, index) => (
                    <div key={index} className={"chat " + (user.firstName === msg.firstName ? "chat-end" : "chat-start")}>
                        <div className="chat-header flex justify-between items-center">
                            <span>{`${msg.firstName} ${msg.lastName}`}</span>
                            {msg.timestamp && (
                                <time className="text-xs opacity-50 ml-2">
                                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                </time>
                            )}
                        </div>
                        <div className="chat-bubble mt-0.5">{msg.text}</div>
                        {msg.seen && user.firstName !== msg.firstName && (
                            <div className="chat-footer text-xs text-gray-400 mt-0.5">Seen</div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-5 border-t border-gray-600 flex items-center gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border border-gray-500 text-white rounded p-2"
                />
                <button onClick={sendMessage} className="btn btn-secondary">Send</button>
            </div>
        </div>
    );
};

export default Chat;



