import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Trip, Playlist, Schedule } from "../types/MyPageTypes";

export function useMyPageData() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tRes, pRes] = await Promise.all([
                    axios.get<Trip[]>("/api/v1/travel/trips", { withCredentials: true }),
                    axios.get<Playlist[]>("/api/v1/music/playlists", { withCredentials: true }),
                ]);
                setTrips(tRes.data);
                setPlaylists(pRes.data);
            } catch {
                setError("데이터를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteTrip = async (id: number) => {
        try {
            await axios.delete(`/api/v1/travel/trips/${id}`, { withCredentials: true });
            setTrips((prev) => prev.filter((t) => t.id !== id));
        } catch {
            setError("여행 삭제에 실패했습니다.");
        }
    };

    const deletePlaylist = async (id: number) => {
        try {
            await axios.delete(`/api/v1/music/playlists/${id}`, { withCredentials: true });
            setPlaylists((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setError("플레이리스트 삭제에 실패했습니다.");
        }
    };

    return { trips, playlists, loading, error, clearError: () => setError(null), deleteTrip, deletePlaylist };
}

export function useTripSchedules(tripId: number | null) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);  // refetch 트리거

    useEffect(() => {
        if (!tripId) { setSchedules([]); return; }

        axios
            .get<{ schedules: Schedule[] }>(`/api/v1/travel/trips/${tripId}`, { withCredentials: true })
            .then((res) => setSchedules(res.data.schedules ?? []))
            .catch(() => setError("일정을 불러오지 못했습니다."));
    }, [tripId, tick]);

    const refetch = useCallback(() => setTick((t) => t + 1), []);

    return { schedules, error, clearError: () => setError(null), refetch };
}