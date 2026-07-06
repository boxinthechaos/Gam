import { Mic2, Clock, RefreshCw, ExternalLink } from "lucide-react";
import type { Song } from "../../types/PlayListTypes";

interface Props {
    index: number;
    song: Song;
    onReplace: (index: number) => void;
}

function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}분 ${sec}초`;
}

export default function SongItem({ index, song, onReplace }: Props) {
    return (
        <div className="
            flex items-center gap-3 
            py-3.5 
            border-b border-gray-100 

            last:border-none"
        >

            {/* 곡 정보 */}
            <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2 mb-1.5">

                    {song.spotifyUrl ? (

                        <a
                            href={song.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                text-sm font-medium text-gray-900 
                                hover:text-[#ff8c00] transition-colors truncate"
                        >
                            {index + 1}. {song.title}
                        </a>

                    ) : (

                        <span className="text-sm font-medium text-gray-900 truncate">
                            {index + 1}. {song.title}
                        </span>

                    )}

                    {song.spotifyUrl && (

                        <a
                            href={song.spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                shrink-0
                                text-gray-300 
                                hover:text-[#ff8c00]  
                                transition-colors"
                            aria-label="Spotify에서 열기"
                        >
                            <ExternalLink size={12} />
                        </a>

                    )}

                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">

                    <span className="flex items-center gap-1">
                        <Mic2 size={12} />
                        {song.artist}
                    </span>

                    <span className="text-gray-200">|</span>

                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(song.durationMs)}
                    </span>

                </div>

            </div>

            {/* 교체 버튼 */}
            <button
                onClick={() => onReplace(index)}
                className="
                    flex items-center gap-1.5 shrink-0
                    px-3 py-1.5 
                    border border-gray-200 rounded-lg 
                    bg-white
                    text-xs text-gray-500

                    hover:border-[#ff8c00] 
                    hover:text-[#ff8c00] 
                    hover:bg-orange-50
                    transition-all cursor-pointer"
            >
                <RefreshCw size={12} />
                교체
            </button>

        </div>
    );
}