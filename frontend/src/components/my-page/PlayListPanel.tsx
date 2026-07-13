import axios from "axios";
import { Music, ExternalLink, Play } from "lucide-react";

import type { Playlist } from "../../types/MyPageTypes";

export default function PlaylistPanel({ playlist }: { playlist: Playlist }) {

    const openYoutubePlaylist = async () => {
        try {
            const response = await axios.get(
                `/api/v1/music/${playlist.id}/youtube`,
                {
                    withCredentials: true, // HttpOnly 쿠키 자동 전송
                }
            );

            const youtubeUrl: string = response.data;

            if (!youtubeUrl) {
                alert("재생할 플레이리스트가 없습니다.");
                return;
            }

            window.open(youtubeUrl, "_blank");
        } catch (error) {
            console.error("유튜브 플레이리스트 열기 실패:", error);
            alert("유튜브 플레이리스트를 불러오지 못했습니다.");
        }
    };

    return (
        <div className="p-1">

            <div className="flex justify-end mb-4">
                <button
                    onClick={openYoutubePlaylist}
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-lg
                        bg-red-600
                        text-white
                        text-sm
                        transition-colors
                        hover:bg-red-700
                    "
                >
                    <Play size={18} />
                    유튜브에서 재생
                </button>
            </div>

            <p className="mb-4 text-xs text-gray-400">
                {playlist.songs.length}곡
            </p>

            {playlist.songs.length === 0 && (
                <p className="py-10 text-sm text-center text-gray-300">
                    곡이 없습니다.
                </p>
            )}

            {playlist.songs.map((song, i) => (
                <div
                    key={song.id}
                    className="
                        flex items-center gap-3
                        px-3 py-3 mb-1.5
                        border border-gray-100
                        rounded-xl
                        transition-colors
                        cursor-pointer
                        hover:border-[#ff8c00]
                    "
                >
                    <div
                        className="
                            flex items-center justify-center
                            w-9 h-9
                            shrink-0
                            rounded-lg
                            bg-orange-50
                        "
                    >
                        <Music
                            size={16}
                            className="text-[#ff8c00]"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {i + 1}. {song.title}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400">
                            {song.artist}
                        </p>
                    </div>

                    {song.spotifyUrl && (
                        <a
                            href={song.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="
                                text-gray-300
                                transition-colors
                                hover:text-[#ff8c00]
                            "
                            aria-label="Spotify에서 열기"
                        >
                            <ExternalLink size={13} />
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}