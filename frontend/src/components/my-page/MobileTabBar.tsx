import { Plane, Music } from "lucide-react";
import type { Trip, Playlist, SidebarView } from "../../types/MyPageTypes";

interface Props {
    trips: Trip[];
    playlists: Playlist[];
    selected: SidebarView | null;
    onSelect: (view: SidebarView) => void;
}

export default function MobileTabBar({ trips, playlists, selected, onSelect }: Props) {
    const isActive = (view: SidebarView) =>
        !!selected && selected.type === view.type && selected.data.id === view.data.id;

    return (
        // 모바일에서만 표시
        <div className="
            flex flex-col shrink-0 
            border-b border-gray-100 
            bg-white 
            
            md:hidden"
        >

            {/* 여행 탭 스크롤 행 */}
            <div className="
                flex items-center gap-2 
                px-4 py-2 
                overflow-x-auto scrollbar-none"
            >

                <span className="shrink-0 text-[11px] text-gray-400 font-medium">
                    여행
                </span>

                {trips.map((trip) => {
                    const view: SidebarView = { type: "trip", data: trip };
                    const active = isActive(view);
                    return (
                        <button
                            key={trip.id}
                            onClick={() => onSelect(view)}
                            className={`
                                flex items-center gap-1.5 shrink-0
                                px-3 py-1.5 rounded-full 
                                border 
                                text-xs font-medium
                                transition-colors cursor-pointer

                                ${active
                                    ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                    : "border-gray-200 bg-white text-gray-500"
                                }
                            `}
                        >
                            <Plane size={11} />
                            {trip.title}
                        </button>
                    );
                })}

            </div>

            {/* 플레이리스트 탭 스크롤 행 */}
            {playlists.length > 0 && (
                <div className="
                    flex items-center gap-2 
                    px-4 py-2 
                    border-t border-gray-50
                    overflow-x-auto scrollbar-none"
                >

                    <span className="shrink-0 text-[11px] text-gray-400 font-medium">
                        플리
                    </span>

                    {playlists.map((pl) => {
                        const view: SidebarView = { type: "playlist", data: pl };
                        const active = isActive(view);
                        return (
                            <button
                                key={pl.id}
                                onClick={() => onSelect(view)}
                                className={`
                                    flex items-center gap-1.5 shrink-0
                                    px-3 py-1.5 
                                    border rounded-full 
                                    text-xs font-medium
                                    transition-colors cursor-pointer

                                    ${active
                                        ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                                        : "border-gray-200 bg-white text-gray-500"
                                    }
                                `}
                            >
                                <Music size={11} />
                                {pl.title}
                            </button>
                        );
                    })}

                </div>
            )}
            
        </div>
    );
}