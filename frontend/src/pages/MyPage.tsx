import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { SidebarView } from "../types/MyPageTypes";

import Navbar from "../components/main-page/NavBar";
import Sidebar from "../components/my-page/SideBar";
import MobileTabBar from "../components/my-page/MobileTabBar";
import MainPanel from "../components/my-page/MainPanel";
import AlertWindow from "../components/windows/AlertWindow";

import { useMyPageData } from "../hooks/useMyPageData";

export default function MyPage() {
    const nav = useNavigate();
    const { trips, playlists, loading, error, clearError, deleteTrip, deletePlaylist } = useMyPageData();
    const [selected, setSelected] = useState<SidebarView | null>(null);

    useEffect(() => {
        if (!loading && trips.length > 0 && !selected) {
            setSelected({ type: "trip", data: trips[0] });
        }
    }, [loading, trips]);

    const handleDeleteTrip = async (id: number): Promise<void> => {
        await deleteTrip(id);
        if (selected?.type === "trip" && selected.data.id === id) {
            setSelected(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <Navbar />
                <div className="flex flex-1 items-center justify-center">
                    <div className="
                        w-6 h-6
                        border-2 border-orange-100 border-t-[#ff8c00] rounded-full
                        animate-spin"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar />

            <MobileTabBar
                trips={trips}
                playlists={playlists}
                selected={selected}
                onSelect={setSelected}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    trips={trips}
                    playlists={playlists}
                    selected={selected}
                    onSelect={setSelected}
                    onDeleteTrip={handleDeleteTrip}
                    onDeletePlaylist={deletePlaylist}
                    onCreateTrip={() => nav("/create-trip")}
                />

                <MainPanel
                    selected={selected}
                    onCreateTrip={() => nav("/create-trip")}
                />
            </div>

            {error && (
                <AlertWindow message={error} onClose={clearError} />
            )}
        </div>
    );
}