import { useState } from "react";
import { Music, Loader2, Save } from "lucide-react";

import Navbar from "../components/main-page/NavBar";
import SongItem from "../components/play-list/Songitem";
import PlaylistSummary from "../components/play-list/PlayListSummary";
import { usePlaylist } from "../hooks/usePlayList";

export default function Playlist() {
    const { songs, loading, saving, error, fetchPlaylist, replaceSong, savePlaylist } = usePlaylist();

    const [keyword, setKeyword] = useState("");
    const [minutes, setMinutes] = useState<number>(30);
    const [plTitle, setPlTitle] = useState("");
    const [saved, setSaved]     = useState(false);

    const handleMake = () => {
        if (!keyword.trim()) { alert("검색어를 입력해주세요."); return; }
        setSaved(false);
        setPlTitle("");
        fetchPlaylist(keyword.trim(), minutes);
    };

    const handleSave = async () => {
        if (!plTitle.trim()) { alert("플레이리스트 제목을 입력해주세요."); return; }
        const ok = await savePlaylist({ title: plTitle.trim(), songs });
        if (ok) setSaved(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            <Navbar />

            <main className="
                flex flex-1 
                items-start justify-center 
                px-4 py-8 
                
                md:py-12"
            >

                <div className="
                    opacity-0
                    w-full max-w-lg
                    border border-gray-100 rounded-2xl
                    bg-white 
                    px-6 py-7 
                    animate-[appear_0.5s_ease-out_0.1s_forwards]
                    
                    md:px-8"
                >

                    {/* 카드 타이틀 */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Music size={18} className="text-[#ff8c00]" />
                        <h1 className="text-base font-bold text-gray-900">
                            GAM 플레이리스트 생성기
                        </h1>
                    </div>

                    {/* 검색 행 */}
                    <div className="flex gap-2 mb-4">

                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleMake()}
                            placeholder="검색어 (예: aespa)"
                            className="
                                flex-1 
                                min-w-0 
                                px-3.5 py-2.5
                                border border-gray-200 rounded-xl
                                text-sm text-gray-700 bg-gray-50
                                outline-none

                                focus:border-[#ff8c00] 
                                focus:ring-2 
                                focus:ring-orange-100
                                transition-all"
                        />

                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                            min={1} max={180}
                            placeholder="30"
                            className="
                                w-16 
                                px-2.5 py-2.5
                                border border-gray-200 rounded-xl
                                bg-gray-50
                                text-sm text-gray-700 text-center
                                outline-none

                                focus:border-[#ff8c00] 
                                focus:ring-2 
                                focus:ring-orange-100
                                transition-all"
                        />

                        <span className="flex items-center shrink-0 text-sm text-gray-400">분</span>

                        <button
                            onClick={handleMake}
                            disabled={loading}
                            className="
                                shrink-0
                                px-5 py-2.5 
                                border-none rounded-xl 
                                bg-[#ff8c00] 
                                text-white text-sm font-bold

                                hover:bg-[#e67e00] 
                                transition-colors cursor-pointer

                                disabled:bg-gray-100 
                                disabled:text-gray-300 
                                disabled:cursor-not-allowed"
                        >
                            만들기
                        </button>

                    </div>

                    {/* 에러 */}
                    {error && (
                        <p className="text-xs text-red-400 mb-3">{error}</p>
                    )}

                    {/* 로딩 */}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-5 text-sm text-gray-400">
                            <Loader2 size={16} className="animate-spin text-[#ff8c00]" />
                            스포티파이에서 곡을 가져오는 중...
                        </div>
                    )}

                    {/* 빈 상태 */}
                    {!loading && songs.length === 0 && !error && (
                        <p className="text-sm text-gray-300 text-center py-5">
                            키워드와 시간을 입력하고 만들기를 눌러보세요.
                        </p>
                    )}

                    {/* 결과 */}
                    {!loading && songs.length > 0 && (
                        <>

                            <PlaylistSummary songs={songs} />

                            <div className="mb-4">
                                {songs.map((song, i) => (
                                    <SongItem
                                        key={`${song.title}-${i}`}
                                        index={i}
                                        song={song}
                                        onReplace={(idx) => replaceSong(keyword, idx)}
                                    />
                                ))}
                            </div>

                            {/* 저장 행 */}
                            <div className="flex gap-2 mt-2">

                                <input
                                    type="text"
                                    value={plTitle}
                                    onChange={(e) => { setPlTitle(e.target.value); setSaved(false); }}
                                    placeholder="플레이리스트 제목"
                                    className="
                                        flex-1 
                                        min-w-0 
                                        px-3.5 py-2.5
                                        border border-gray-200 rounded-xl
                                        text-sm text-gray-700 bg-gray-50
                                        outline-none

                                        focus:border-[#ff8c00] 
                                        focus:ring-2 
                                        focus:ring-orange-100
                                        transition-all"
                                />

                                <button
                                    onClick={handleSave}
                                    disabled={saving || saved}
                                    className={`
                                        flex items-center gap-1.5 shrink-0
                                        px-5 py-2.5 
                                        border-none rounded-xl 
                                        text-sm font-medium
                                        transition-all cursor-pointer
                                        ${saved
                                            ? "bg-emerald-500 text-white cursor-default"
                                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                                        }
                                        disabled:opacity-60 disabled:cursor-not-allowed
                                    `}
                                >
                                    {saving
                                        ? <Loader2 size={14} className="animate-spin" />
                                        : <Save size={14} />
                                    }
                                    {saved ? "저장됨" : "저장하기"}
                                </button>

                            </div>

                            {saved && (
                                <p className="text-xs text-emerald-500 text-center mt-2">
                                    마이페이지에서 확인할 수 있어요 ✓
                                </p>
                            )}

                        </>
                    )}

                </div>

            </main>

        </div>
    );
}