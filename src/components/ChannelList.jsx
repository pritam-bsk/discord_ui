import { useEffect, useState } from "react";

export default function ChannelList({ selectedServer, selectedChannel, setSelectedChannel, onClose }) {
    const [channels, setChannels] = useState([]);
    const [inviteCode, setInviteCode] = useState("");
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");

    useEffect(() => {
        if (!selectedServer) return;

        const fetchChannels = async () => {
            try {
                const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

                const res = await fetch(import.meta.env.VITE_API_URI + `/servers/${selectedServer._id}/channels`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (!res.ok) {
                    console.error("Failed to fetch channels:", res.status);
                    return;
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    setChannels(data);
                } else {
                    console.error("Channels response is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching channels:", error);
            }
        };
        fetchChannels();
    }, [selectedServer]);

    if (!selectedServer) {
        return (
            <div className="hidden md:flex w-60 h-screen bg-[#2B2D31] items-center justify-center">
                <p className="text-[#B5BAC1] text-sm">Select a server</p>
            </div>
        );
    }

    const createChanel = () => {
        setIsCreateChannelModalOpen(true);
    }

    const submitCreateChannel = async () => {
        const channelName = newChannelName.trim();
        if (!channelName) return;

        try {
            const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
            const res = await fetch(import.meta.env.VITE_API_URI + `/servers/${selectedServer._id}/channels`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name: channelName })
            });
            if (!res.ok) {
                console.error("Failed to create channel:", res.status);
                return;
            }
            const newChannel = await res.json();
            setSelectedChannel(newChannel.data);
            setChannels((prev) => [...prev, newChannel.data]);
            setIsCreateChannelModalOpen(false);
            setNewChannelName("");
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    }

    const share = async () => {
        try {
            const res = await fetch(import.meta.env.VITE_API_URI + `/invites/create/${selectedServer._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken"))
                },
            });
            if (!res.ok) {
                console.error("Failed to create invite:", res.status);
                return;
            }
            const data = await res.json();
            setInviteCode(data.data.code);
            setIsInviteModalOpen(true);
        } catch (error) {
            console.error("Error creating invite:", error);
        }
    }

    return (
        <>
            <div className="w-full md:w-60 h-screen bg-[#2B2D31] flex flex-col">
                <div className="h-12 px-4 flex items-center justify-between border-b border-[#1E1F22] shadow-md">
                    <button
                        onClick={onClose}
                        className="md:hidden text-[#B5BAC1] hover:text-white mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                    </button>
                    <h2 className="text-white font-semibold truncate flex-1">{selectedServer.name}</h2>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            className="text-[#B5BAC1] hover:text-white ml-2"
                            aria-label="Add channel"
                            onClick={() => { createChanel() }}
                        >
                            <div className="flex items-center gap-1 p-2 bg-[#393C43] rounded hover:bg-[#5865F2] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6A.5.5 0 0 1 8 1z" />
                                </svg>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="text-[#B5BAC1] hover:text-white ml-2"
                            aria-label="share channel"
                            onClick={() => { share() }}
                        >
                            <div className="flex items-center gap-1 p-2 bg-[#393C43] rounded hover:bg-[#5865F2] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share" viewBox="0 0 16 16">
                                    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                                </svg>
                            </div>
                        </button>

                    </div>
                </div>
                <div className="flex-1 overflow-y-auto pt-4">
                    {channels.length === 0 ? (
                        <p className="text-[#B5BAC1] text-sm px-4">No channels</p>
                    ) : (
                        <>
                            {channels.map((channel) => {
                                const isSelected = selectedChannel?._id === channel._id;
                                return (
                                    <div
                                        key={channel._id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={`px-2 py-1.5 mx-2 rounded cursor-pointer group transition-colors ${isSelected ? 'bg-[#393C43]' : 'hover:bg-[#393C43]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`${isSelected ? 'text-white' : 'text-[#B5BAC1]'
                                                }`}>#</span>
                                            <span className={`${isSelected ? 'text-white' : 'text-[#B5BAC1] group-hover:text-[#DBDEE1]'
                                                }`}>
                                                {channel.name}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div key="separator" className="w-[90%] h-1 bg-[#393C43] rounded m-4 mr-2"></div>
                        </>
                    )}
                </div>
            </div>
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-[90%] max-w-sm rounded-md bg-[#2B2D31] border border-[#1E1F22] p-5">
                        <h3 className="text-white text-lg font-semibold">Invite Created</h3>
                        <p className="text-[#B5BAC1] text-sm mt-2">Share this code with your friends:</p>
                        <div className="mt-3 rounded bg-[#1E1F22] px-3 py-2 text-[#DBDEE1] font-mono break-all">
                            {inviteCode}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsInviteModalOpen(false);
                                    setInviteCode("");
                                }}
                                className="px-4 py-2 rounded bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateChannelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-[90%] max-w-sm rounded-md bg-[#2B2D31] border border-[#1E1F22] p-5">
                        <h3 className="text-white text-lg font-semibold">Create Channel</h3>
                        <p className="text-[#B5BAC1] text-sm mt-2">Enter channel name</p>
                        <input
                            type="text"
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            placeholder="channel-name"
                            className="mt-3 w-full rounded bg-[#1E1F22] border border-[#393C43] px-3 py-2 text-[#DBDEE1] outline-none focus:border-[#5865F2]"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateChannelModalOpen(false);
                                    setNewChannelName("");
                                }}
                                className="px-4 py-2 rounded bg-[#393C43] text-white hover:bg-[#4a4d55] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submitCreateChannel}
                                className="px-4 py-2 rounded bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
