import { useState } from "react";
import type { Song, SavePlaylistForm } from "../types/PlayListTypes";

export function usePlaylist() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 플레이리스트 생성
    const fetchPlaylist = async (keyword: string, minutes: number) => {
        setLoading(true);
        setError(null);
        setSongs([]);
        try {
            const res = await fetch(
                `/api/v1/music/recommend?minutes=${minutes}&keyword=${encodeURIComponent(keyword)}`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("플레이리스트를 가져오지 못했습니다.");
            const data: Song[] = await res.json();
            setSongs(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 단일 곡 교체
    const replaceSong = async (keyword: string, index: number) => {
        try {
            const excludeTitles = songs.map((s) => s.title);
            const params = new URLSearchParams({ keyword });
            excludeTitles.forEach((t) => params.append("excludeTitles", t));

            const res = await fetch(`/api/v1/music/replace?${params.toString()}`, {
                credentials: "include",
            });
            if (res.status === 204) {
                alert("교체할 곡이 없습니다.");
                return;
            }
            const newSong: Song = await res.json();
            setSongs((prev) => prev.map((s, i) => (i === index ? newSong : s)));
        } catch (e) {
            setError(e instanceof Error ? e.message : "교체에 실패했습니다.");
        }
    };

    // 저장
    const savePlaylist = async (form: SavePlaylistForm): Promise<boolean> => {
        setSaving(true);
        try {
            const res = await fetch("/api/v1/music/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            if (res.status === 401) {
                alert("로그인이 필요합니다.");
                return false;
            }
            if (!res.ok) throw new Error("저장에 실패했습니다.");
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    return { songs, loading, saving, error, fetchPlaylist, replaceSong, savePlaylist };
}