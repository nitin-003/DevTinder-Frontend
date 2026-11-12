import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import ErrorAlert from './ErrorAlert';
import { getErrorMessage } from '../utils/getErrorMessage';

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadError, setLoadError] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [connected, setConnected] = useState(true);
    const bottomRef = useRef(null);
    const socketRef = useRef(null);
    const requestRef = useRef(0);
    const user = useSelector(store => store.user);
    const userId = user?._id;

    // `replace` is used after a reconnect: reload the whole conversation so
    // messages sent during the outage show up, instead of merging with live ones.
    const fetchChatMessages = async ({ replace = false } = {}) => {
        const requestId = ++requestRef.current;
        setLoadError("");
        setLoadingHistory(true);
        try {
            const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
                withCredentials: true
            });
            // a newer request (or another chat) took over; drop this stale response
            if (requestId !== requestRef.current) return;

            const history = (chat?.data?.messages ?? []).map((msg) => {
                const { senderId, text, createdAt, seen } = msg;
                return {
                    firstName: senderId?.firstName,
                    lastName: senderId?.lastName,
                    text,
                    timestamp: createdAt,
                    seen
                };
            });
            // keep any live message that arrived while history was loading
            setMessages((live) => (replace ? history : [...history, ...live]));
        } catch (err) {
            if (requestId !== requestRef.current) return;
            console.error(err);
            setLoadError(getErrorMessage(err, "Couldn't load this conversation."));
        } finally {
            if (requestId === requestRef.current) setLoadingHistory(false);
        }
    };

    useEffect(() => {
        setMessages([]);
        fetchChatMessages();
    }, [targetUserId]);

    useEffect(() => {
        if (!user) return;

        const socket = createSocketConnection();
        socketRef.current = socket;

        // join on every (re)connect, otherwise the room is lost after a network drop
        let hasConnectedBefore = false;
        const joinRoom = () => {
            setConnected(true);
            socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
            // after a reconnect, catch up on anything missed while offline
            if (hasConnectedBefore) fetchChatMessages({ replace: true });
            hasConnectedBefore = true;
        };

        socket.on("connect", joinRoom);
        socket.on("disconnect", () => setConnected(false));
        socket.on("connect_error", () => setConnected(false));
        socket.on("messageReceived", ({ firstName, lastName, text, timestamp, seen }) => {
            setMessages(messages => [...messages, { firstName, lastName, text, timestamp, seen }]);
        });

        return () => {
            socket.off();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId, targetUserId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        const text = newMessage.trim();
        const socket = socketRef.current;
        if (!text || !socket || !connected || !user) return;

        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text
        });
        setNewMessage("");
    };

    return (
        <div className="surface-card w-[calc(100%-2rem)] max-w-3xl mx-auto my-4 sm:my-6 h-[calc(100vh-9rem)] min-h-[24rem] flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 sm:px-5 py-3 border-b border-base-content/10 flex items-center gap-3">
                <div className="tooltip tooltip-right" data-tip="Back to connections">
                    <Link to="/connections" className="btn btn-ghost btn-sm btn-circle" aria-label="Back to connections">←</Link>
                </div>
                <h1 className="text-lg font-semibold">Chat</h1>
            </div>

            {!connected && (
                <div role="status" className="px-4 py-2 text-sm text-warning bg-warning/10 border-b border-warning/30 flex items-center gap-2">
                    <span className="loading loading-spinner loading-xs"></span>
                    Connection lost. Trying to reconnect...
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-base-200/50">
                {loadingHistory && (
                    <div className="flex justify-center mt-10">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                )}
                {loadError && (
                    <div className="mt-4 space-y-3 text-center">
                        <ErrorAlert message={loadError} />
                        <button type="button" onClick={() => fetchChatMessages()} className="btn btn-outline btn-sm">Try again</button>
                    </div>
                )}
                {!loadingHistory && !loadError && messages.length === 0 && (
                    <p className="text-center text-base-content/60 mt-10">No messages yet. Say hi 👋</p>
                )}
                {messages.map((msg, index) => {
                    const isMine = user?.firstName === msg.firstName;
                    return (
                    <div key={index} className={"chat " + (isMine ? "chat-end" : "chat-start")}>
                        <div className="chat-header flex items-center">
                            <span>{`${msg.firstName} ${msg.lastName}`}</span>
                            {msg.timestamp && (
                                <span className="tooltip tooltip-top ml-2" data-tip={format(new Date(msg.timestamp), "PPp")}>
                                    <time className="text-xs opacity-50">
                                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                                    </time>
                                </span>
                            )}
                        </div>
                        <div className={"chat-bubble mt-0.5 break-words " + (isMine ? "chat-bubble-primary" : "")}>{msg.text}</div>
                        {msg.seen && !isMine && (
                            <div className="chat-footer text-xs text-base-content/60 mt-0.5">Seen</div>
                        )}
                    </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
            <div className="p-3 sm:p-4 border-t border-base-content/10 flex items-center gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    placeholder={connected ? "Type a message..." : "Reconnecting..."}
                    className="input input-bordered flex-1 min-w-0"
                />
                <div
                    className="tooltip tooltip-left"
                    data-tip={!connected ? "You're offline. Reconnecting..." : !newMessage.trim() ? "Type a message first" : "Send (Enter)"}
                >
                    <button onClick={sendMessage} disabled={!newMessage.trim() || !connected} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
