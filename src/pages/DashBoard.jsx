import { useEffect, useState } from "react"
import ServerList from "../components/ServerList"
import ChannelList from "../components/ChannelList"
import ChatRoom from "../components/ChatRoom"

export default function DashBoard() {
    const [selectedServer, setSelectedServer] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showChannels, setShowChannels] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        if (!token) {
            window.location.href = "/login";
        }
    }, [])

    const handleServerSelect = (server) => {
        setSelectedServer(server);
        setSelectedChannel(null);
        setShowChannels(true);
    };

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
    };

    const handleCloseChannels = () => {
        setShowChannels(false);
    };

    const handleCloseChatRoom = () => {
        setSelectedChannel(null);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className={`${showChannels || selectedChannel ? 'hidden md:block' : 'block'}`}>
                <ServerList
                    selectedServer={selectedServer}
                    setSelectedServer={handleServerSelect}
                />
            </div>
            <div className={`${
                selectedChannel ? 'hidden md:block' : showChannels ? 'flex-1 md:flex-none' : 'hidden md:block'
            }`}>
                <ChannelList
                    selectedServer={selectedServer}
                    selectedChannel={selectedChannel}
                    setSelectedChannel={handleChannelSelect}
                    onClose={handleCloseChannels}
                />
            </div>
            <div className={`${selectedChannel ? 'flex' : 'hidden'} md:flex flex-1`}>
                <ChatRoom
                    selectedServer={selectedServer}
                    selectedChannel={selectedChannel}
                    onClose={handleCloseChatRoom}
                />
            </div>
        </div>
    )
}