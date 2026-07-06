import { Music, ExternalLink } from "lucide-react";

import type { Playlist } from "../../types/MyPageTypes";

export default function PlaylistPanel({ playlist }: { playlist: Playlist }) {
    return (
        <div className="p-1">

            <p className="mb-4 text-xs text-gray-400">
                {playlist.songs.length}곡
            </p>

            {playlist.songs.length === 0 && (
                <p className="py-10 text-sm text-gray-300 text-center">
                    곡이 없습니다.
                </p>
            )}

            {playlist.songs.map((song, i) => (
                <div
                    key={song.id}
                    className="
                        flex items-center gap-3
                        px-3 py-3 mb-1.5
                        border border-gray-100 rounded-xl
                        transition-colors cursor-pointer

                        hover:border-[#ff8c00]"
                >

                    <div className="
                        flex items-center justify-center shrink-0
                        w-9 h-9 
                        rounded-lg 
                        bg-orange-50"
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
                                
                                hover:text-[#ff8c00] "
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