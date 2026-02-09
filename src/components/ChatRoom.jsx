import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';

export default function ChatRoom({ selectedServer, selectedChannel, onClose }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const socket = io(import.meta.env.VITE_BACKEND_URI, {
        auth: {
            token: localStorage.getItem("accessToken"),
        },
    })

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!selectedChannel || !selectedServer) return;
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
                const res = await fetch(import.meta.env.VITE_API_URI + `/messages/${selectedChannel._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (!res.ok) {
                    console.error("Failed to fetch messages:", res.status);
                    return;
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error("Messages response is not an array:", data);
                }
                socket.emit("channel:join", selectedChannel._id);
                return () => {
                    socket.emit("channel:leave", selectedChannel._id);
                };
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [selectedChannel, selectedServer]);
    useEffect(() => {
        if (!selectedChannel) return;
        socket.on("message:new", (message) => {
            setMessages((prev) => [...prev, message])
        })
    }, [selectedChannel, selectedServer])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        socket.emit("message:send", {
            channelId: selectedChannel._id,
            content: messageInput.trim(),
        });

        setMessageInput("");
    };
    if (!selectedChannel) {
        return (
            <div className="hidden md:flex flex-1 bg-[#313338] items-center justify-center">
                <p className="text-[#B5BAC1] text-sm">Select a channel</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-[#313338] overflow-hidden">
            <div className="h-12 px-4 flex items-center border-b border-[#1E1F22] shadow-md shrink-0">
                <button
                    onClick={onClose}
                    className="md:hidden text-[#B5BAC1] hover:text-white mr-2 shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </button>
                <span className="text-[#B5BAC1] mr-2">#</span>
                <h2 className="text-white font-semibold truncate">{selectedChannel.name}</h2>
            </div>

            <div className="flex-1 overflow-y-scroll p-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[#B5BAC1] text-sm">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[#B5BAC1] text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message._id} className="group">
                            <div className="flex items-start gap-3 hover:bg-[#2C2F33] rounded px-2 py-1">
                                <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0-xs font-bold text-white">
                                    {message.senderId?.username[0] || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-white font-medium text-sm">{message.senderId?.username || "Unknown"}</span>
                                        <span className="text-[#949BA4] text-xs">{new Date(message.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[#DBDEE1] text-sm wrap-break-word">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-4 shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message #${selectedChannel.name}`}
                        className="flex-1 bg-[#1E1F22] border-none rounded px-3 py-2.5 text-[#DBDEE1] placeholder-[#949BA4] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
                    />
                    <button
                        type="submit"
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2.5 rounded transition-colors"
                    >Send
                    </button>
                </form>
            </div>
        </div>
    );
}
