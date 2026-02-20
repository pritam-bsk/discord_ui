import { useEffect, useState } from "react"

export default function ServerList({ selectedServer, setSelectedServer }) {
    const [serverList, setServerList] = useState([]);

    useEffect(() => {
        const fetchServerList = async () => {
            try {
                const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
                //console.log(token);

                const res = await fetch(import.meta.env.VITE_API_URI + "/servers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });
                if (!res.ok) {
                    console.error("Failed to fetch servers:", res.status);
                    return;
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setServerList(data);
                } else {
                    console.error("Server response is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching server list:", error);
            }
        }
        fetchServerList();
    }, [])


    const createServer = async () => {
        const serverName = prompt("Enter server name");
        if (!serverName) return;

        try {
            const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
            const res = await fetch(import.meta.env.VITE_API_URI + "/servers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ name: serverName })
            });
            if (!res.ok) {
                console.error("Failed to create server:", res.status);
                return;
            }
            const newServer = await res.json();
            setServerList((prev) => [...prev, newServer]);
        } catch (error) {
            console.error("Error creating server:", error);
        }
    }

    const joinServer = async () => {
        const inviteCode = prompt("Enter invite code");
        if (!inviteCode) return;

        try {
            const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
            const res = await fetch(import.meta.env.VITE_API_URI + `/invites/join/${inviteCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            });
            if (!res.ok) {
                console.error("Failed to join server:", res.status);
                alert("Invalid invite code!");
                return;
            }
            const data = await res.json();
            setServerList((prev) => [...prev, data.data.server]);
        } catch (error) {
            console.error("Error joining server:", error);
        }
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

            await fetch(import.meta.env.VITE_API_URI + "/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            });
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            window.location.href = "/login";
        }
    }

    return (
        <div className="w-16 md:w-16 h-screen bg-[#202020] flex flex-col items-center py-3 md:py-4 overflow-y-auto shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#313338] hover:bg-[#5865F2] rounded-2xl mb-2 flex items-center justify-center cursor-pointer transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="md:w-7 md:h-7 text-white" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                </svg>
            </div>
            <div className="w-8 h-0.5 bg-[#313338] rounded mb-2"></div>
            {serverList.map((server) => {
                const isSelected = selectedServer?._id === server._id;
                return (
                    <div key={server._id} onClick={() => setSelectedServer(server)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-2 flex items-center justify-center text-sm md:text-base font-bold cursor-pointer transition-all ${isSelected ? 'bg-[#5865F2] rounded-2xl' : 'bg-[#313338] hover:bg-[#5865F2] hover:rounded-2xl'}`}
                    > {server.name[0]} </div>
                )
            })}
            <div className="w-8 h-0.5 bg-[#313338] rounded mb-2"></div>
            <div onClick={() => { createServer() }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-2 flex items-center justify-center text-sm md:text-base font-bold cursor-pointer transition-all bg-[#313338] hover:bg-[#5865F2] hover:rounded-2xl`}
            > <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg></div>
            <div onClick={() => { joinServer() }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-2 flex items-center justify-center text-sm md:text-base font-bold cursor-pointer transition-all bg-[#313338] hover:bg-[#5865F2] hover:rounded-2xl`}
            > <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg></div>

            {/* Logout Button */}
            <div className="mt-auto">
                <div onClick={handleLogout}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all bg-[#313338] hover:bg-red-600"
                    title="Logout"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}