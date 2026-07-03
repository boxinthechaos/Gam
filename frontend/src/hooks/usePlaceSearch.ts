import { useState, useEffect } from "react";
import axios from "axios";
import type { Category, Place } from "../types/SearchTypes";

const CATEGORY_ENDPOINT: Record<Category, string> = {
    food:  "restaurants",
    hotel: "hotels",
    tour:  "attractions",
};

type RawItem = {
    title: string;
    category: string;
    roadAddress: string;
    mapx: string;
    mapy: string;
    link?: string;
    bookingUrl?: string;
};

function toPlace(raw: RawItem, category: Category, index: number): Place {
    return {
        id:       index,
        name:     raw.title,
        address:  raw.roadAddress,
        category,
        lat:      Number(raw.mapy),
        lng:      Number(raw.mapx),
    };
}

export function usePlaceSearch(category: Category, keyword: string) {
    const [places, setPlaces]   = useState<Place[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!keyword.trim()) {
            setPlaces([]);
            return;
        }

        const controller = new AbortController();
        const endpoint   = CATEGORY_ENDPOINT[category];

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.get<RawItem[]>(`/api/v1/travel/${endpoint}`, {
                    params:          { region: keyword },
                    withCredentials: true,
                    signal:          controller.signal,
                });
                setPlaces(res.data.map((item, idx) => toPlace(item, category, idx)));
            } catch (err: unknown) {
                if (!axios.isCancel(err)) console.error(err);
                setPlaces([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [category, keyword]);

    return { places, loading };
}