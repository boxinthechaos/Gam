import { useState, useEffect } from "react";
import type { Category, Place } from "../types/SearchTypes";

// 프론트 카테고리 이름과 백엔드 API 경로가 달라서 매핑이 필요함
const CATEGORY_ENDPOINT: Record<Category, string> = {
    food: "restaurants",
    hotel: "hotels",
    tour: "attractions",
};

// 백엔드(카카오 API 원본 형태)에서 내려주는 응답 형태
type RawItem = {
    title: string;
    category: string;
    roadAddress: string;
    mapx: string;
    mapy: string;
    link?: string;
    bookingUrl?: string;
};

// 백엔드 응답 -> 프론트 Place 타입으로 변환
// 카테고리는 백엔드의 한글 카테고리 문자열이 아니라, 우리가 어떤 엔드포인트를
// 호출했는지(food/hotel/tour)를 그대로 사용함
function toPlace(raw: RawItem, category: Category, index: number): Place {
    return {
        id: index,
        name: raw.title,
        address: raw.roadAddress,
        category,
        lat: Number(raw.mapy),
        lng: Number(raw.mapx),
    };
}

export function usePlaceSearch(category: Category, keyword: string) {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!keyword.trim()) {
            setPlaces([]);
            return;
        }

        const controller = new AbortController();
        const endpoint = CATEGORY_ENDPOINT[category];

        // 입력을 멈춘 뒤 500ms 후에만 실제 API를 호출 (디바운스)
        // -> 매 글자마다 호출되어 카카오 API rate limit(429)에 걸리는 문제 방지
        const timer = setTimeout(() => {
            setLoading(true);
            fetch(`/api/v1/travel/${endpoint}?region=${encodeURIComponent(keyword)}`, {
                credentials: "include",
                signal: controller.signal,
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
                    return res.json();
                })
                .then((data: RawItem[]) =>
                    setPlaces(data.map((item, idx) => toPlace(item, category, idx)))
                )
                .catch((err) => {
                    if (err.name !== "AbortError") console.error(err);
                    setPlaces([]);
                })
                .finally(() => setLoading(false));
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [category, keyword]);

    return { places, loading };
}