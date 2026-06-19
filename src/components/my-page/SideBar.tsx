import { Plane, Music, Plus, Trash2 } from "lucide-react";

import type { MyPageSideBarProps } from "../../types/MyPageSideBarProps";
import type { SidebarView } from "../../types/MyPageTypes";

export default function Sidebar({
    trips, playlists, selected,
    onSelect, onDeleteTrip, onDeletePlaylist, onCreateTrip,
}: MyPageSideBarProps) {

    const isActive = (view: SidebarView) =>
        !!selected && selected.type === view.type && selected.data.id === view.data.id;

    return (
        // 데스크탑에서만 표시
        <aside className="
            hidden 
            flex-col shrink-0
            w-64
            py-4
            border-r border-gray-100
            bg-white
            overflow-y-auto
            
            md:flex"
        >

            {/* 내 여행 */}
            <p className="px-5 mb-2 text-xs font-bold text-gray-400">내 여행</p>

            {trips.map((trip) => {
                const view: SidebarView = { type: "trip", data: trip };
                const active = isActive(view);
                return (
                    <div
                        key={trip.id}
                        onClick={() => onSelect(view)}
                        className={`
                            group 
                            flex items-center gap-2.5
                            mx-3 mb-0.5 px-3 py-2
                            rounded-xl 
                            text-sm
                            cursor-pointer transition-colors

                            ${active
                                ? "bg-orange-50 text-[#ff8c00] font-medium"
                                : "text-gray-500 hover:bg-gray-50"
                            }
                        `}
                    >

                        <Plane
                            size={14}
                            className={`shrink-0 ${active ? "text-[#ff8c00]" : "text-gray-400"}`}
                        />

                        <span className="flex-1 truncate">
                            {trip.title}
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}
                            className="
                                hidden 
                                group-hover:flex items-center justify-center shrink-0
                                w-5 h-5 
                                border-none rounded 
                                bg-transparent
                                text-gray-300 
                                cursor-pointer transition-colors

                                hover:text-red-400"
                            aria-label="여행 삭제"
                        >
                            <Trash2 size={12} />
                        </button>

                    </div>
                );
            })}

            {/* 새 여행 만들기 */}
            <button
                onClick={onCreateTrip}
                className="
                    flex items-center gap-2
                    mx-3 mt-1 px-3 py-2
                    rounded-xl border border-gray-200 bg-white
                    text-sm text-gray-400
                    cursor-pointer transition-colors

                    hover:border-[#ff8c00] 
                    hover:bg-[#ff8c00]
                    hover:text-white
                    hover:font-semibold"
            >
                <Plus size={14} />
                새 여행 만들기
            </button>

            {/* 구분선 */}
            <div className="mx-5 my-4 border-t border-gray-100" />

            {/* 내 플레이리스트 */}
            <p className="px-5 mb-2 text-xs font-bold text-gray-400">
                내 플레이리스트
            </p>

            {playlists.length === 0 && (
                <p className="px-6 py-1 text-xs text-gray-300">
                    저장된 플리가 없어요
                </p>
            )}

            {playlists.map((pl) => {
                const view: SidebarView = { type: "playlist", data: pl };
                const active = isActive(view);
                return (
                    <div
                        key={pl.id}
                        onClick={() => onSelect(view)}
                        className={`
                            group flex items-center gap-2.5
                            mx-3 mb-0.5 px-3 py-2
                            rounded-xl text-sm
                            cursor-pointer transition-colors

                            ${active
                                ? "bg-orange-50 text-[#ff8c00] font-medium"
                                : "text-gray-500 hover:bg-gray-50"
                            }
                        `}
                    >

                        <Music
                            size={14}
                            className={`shrink-0 ${active ? "text-[#ff8c00]" : "text-gray-400"}`}
                        />

                        <span className="flex-1 truncate">
                            {pl.title}
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); onDeletePlaylist(pl.id); }}
                            className="
                                hidden group-hover:flex items-center justify-center shrink-0
                                w-5 h-5 
                                border-none rounded 
                                bg-transparent
                                text-gray-300 cursor-pointer transition-colors

                                hover:text-red-400"
                            aria-label="플레이리스트 삭제"
                        >
                            <Trash2 size={12} />
                        </button>

                    </div>
                );
            })}

        </aside>
    );
}