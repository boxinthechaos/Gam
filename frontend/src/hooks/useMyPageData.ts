import { useState, useEffect } from "react";
import type { Trip, Playlist, Schedule } from "../types/MyPageTypes";

export function useMyPageData() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tRes, pRes] = await Promise.all([
                    fetch("/api/v1/travel/trips", { credentials: "include" }),
                    fetch("/api/v1/music/playlists", { credentials: "include" }),
                ]);
                if (tRes.ok) setTrips(await tRes.json());
                if (pRes.ok) setPlaylists(await pRes.json());
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteTrip = async (id: number) => {
        await fetch(`/api/v1/travel/trips/${id}`, { method: "DELETE", credentials: "include" });
        setTrips(prev => prev.filter(t => t.id !== id));
    };

    const deletePlaylist = async (id: number) => {
        await fetch(`/api/v1/music/playlists/${id}`, { method: "DELETE", credentials: "include" });
        setPlaylists(prev => prev.filter(p => p.id !== id));
    };

    return { trips, playlists, loading, deleteTrip, deletePlaylist };
}

export function useTripSchedules(tripId: number | null) {
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (!tripId) { setSchedules([]); return; }
        fetch(`/api/v1/travel/trips/${tripId}`, { credentials: "include" })
            .then(r => r.json())
            .then(data => setSchedules(data.schedules ?? []));
    }, [tripId]);

    return schedules;
}