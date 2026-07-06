import type { Song } from "../../types/PlayListTypes";

function formatTotal(songs: Song[]): string {
    const totalSec = Math.floor(songs.reduce((acc, s) => acc + s.durationMs, 0) / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}분 ${sec}초`;
}

export default function PlaylistSummary({ songs }: { songs: Song[] }) {
    return (
        <div className="
            mb-4 px-4 py-2.5 
            border border-orange-100 rounded-xl 
            bg-orange-50  
            text-sm font-medium text-center text-orange-700"
        >
            총 {songs.length}곡 (총 재생 시간: {formatTotal(songs)})
        </div>
    );
}