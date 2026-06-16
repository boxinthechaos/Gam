import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { SidebarView } from "../types/MyPageTypes";

import Navbar from "../components/main-page/NavBar";
import Sidebar from "../components/my-page/SideBar";
import MobileTabBar from "../components/my-page/MobileTabBar";
import MainPanel from "../components/my-page/MainPanel";

import { useMyPageData } from "../hooks/useMyPageData";

export default function MyPage() {
    const nav = useNavigate();
    const { trips, playlists, loading, deleteTrip, deletePlaylist } = useMyPageData();
    const [selected, setSelected] = useState<SidebarView | null>(null);

    // 첫 여행 자동 선택
    useEffect(() => {
        if (!loading && trips.length > 0 && !selected) {
            setSelected({ type: "trip", data: trips[0] });
        }
    }, [loading, trips]);

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

            {/* 모바일 탭바 — md 미만에서만 표시 */}
            <MobileTabBar
            trips={trips}
            playlists={playlists}
            selected={selected}
            onSelect={setSelected}
            />

            <div className="flex flex-1 overflow-hidden">

                {/* 데스크탑 사이드바 — md 이상에서만 표시 */}
                <Sidebar
                trips={trips}
                playlists={playlists}
                selected={selected}
                onSelect={setSelected}
                onDeleteTrip={deleteTrip}
                onDeletePlaylist={deletePlaylist}
                onCreateTrip={() => nav("/trip/create")}
                />

                <MainPanel
                selected={selected}
                onCreateTrip={() => nav("/trip/create")}
                />

            </div>
        </div>
    );
}