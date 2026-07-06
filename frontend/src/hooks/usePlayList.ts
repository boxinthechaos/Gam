import { useState } from "react";
import axios from "axios";

import type { Song, SavePlaylistForm } from "../types/PlayListTypes";

interface UsePlaylistReturn {
    songs: Song[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    alert: string | null;
    clearAlert: () => void;
    fetchPlaylist: (keyword: string, minutes: number) => Promise<void>;
    replaceSong: (keyword: string, index: number) => Promise<string | null>;
    savePlaylist: (form: SavePlaylistForm) => Promise<{ ok: boolean; message: string }>;
}

export function usePlaylist(): UsePlaylistReturn {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);   // 로딩 실패 인라인 표시
    const [alert, setAlert] = useState<string | null>(null);   // 저장/교체 실패 AlertWindow

    const fetchPlaylist = async (keyword: string, minutes: number): Promise<void> => {
        setLoading(true);
        setError(null);
        setSongs([]);
        try {
            const res = await axios.get<Song[]>("/api/v1/music/recommend", {
                params: { minutes, keyword },
                withCredentials: true,
            });
            setSongs(res.data);
        } catch {
            setError("플레이리스트를 가져오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const replaceSong = async (keyword: string, index: number): Promise<string | null> => {
        try {
            const excludeTitles: string[] = songs.map((s) => s.title);
            const params = new URLSearchParams({ keyword });
            excludeTitles.forEach((t) => params.append("excludeTitles", t));

            const res = await axios.get<Song>(`/api/v1/music/replace?${params.toString()}`, {
                withCredentials: true,
                validateStatus: (status: number) => status === 200 || status === 204,
            });

            if (res.status === 204) return "교체할 곡이 없습니다.";

            setSongs((prev: Song[]) => prev.map((s, i) => (i === index ? res.data : s)));
            return null;
        } catch {
            setAlert("교체에 실패했습니다.");
            return null;
        }
    };

    const savePlaylist = async (form: SavePlaylistForm): Promise<{ ok: boolean; message: string }> => {
        setSaving(true);
        try {
            await axios.post("/api/v1/music/save", form, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            return { ok: true, message: "저장되었습니다." };
        } catch (e: unknown) {
            if (axios.isAxiosError(e) && e.response?.status === 401) {
                return { ok: false, message: "로그인이 필요합니다." };
            }
            setAlert("저장에 실패했습니다.");
            return { ok: false, message: "저장에 실패했습니다." };
        } finally {
            setSaving(false);
        }
    };

    return {
        songs, loading, saving,
        error,
        alert, clearAlert: (): void => setAlert(null),
        fetchPlaylist, replaceSong, savePlaylist,
    };
}