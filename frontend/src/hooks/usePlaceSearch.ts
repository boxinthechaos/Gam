import { useState, useEffect } from "react";
import type { Category, Place } from "../types/SearchTypes";

export function usePlaceSearch(category: Category, keyword: string) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!keyword.trim()) {
            setPlaces([]);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        fetch(`/api/v1/travel/${category}?region=${encodeURIComponent(keyword)}`, {
            credentials: "include",
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data: Place[]) => setPlaces(data))
            .catch((err) => {
                if (err.name !== "AbortError") console.error(err);
            })
            .finally(() => setLoading(false));

        // 이전 요청 취소 (키워드 빠르게 바꿀 때)
        return () => controller.abort();
    }, [category, keyword]);

    return { places, loading };
}