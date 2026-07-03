import { useState, useEffect } from "react";
import axios from "axios";
import type { TripSummary } from "../types/TripSummary";

export function useMyTrips() {
    const [trips, setTrips] = useState<TripSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios
            .get<TripSummary[]>("/api/v1/travel/trips", { withCredentials: true })
            .then((res) => setTrips(res.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    return { trips, loading };
}