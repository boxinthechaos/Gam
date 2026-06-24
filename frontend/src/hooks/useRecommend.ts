import { useState } from "react";
import type { RecommendForm, RecommendResult } from "../types/RecommendTypes";

export function useRecommend() {
    const [result, setResult]   = useState<RecommendResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError]     = useState<string | null>(null);

    const fetchRecommend = async (form: RecommendForm) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/v1/travel/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    companion: form.companion,
                    scenery: form.scenery,
                    style: form.style,
                    transport: form.transport,
                }),
            });

            if (!res.ok) throw new Error("추천 요청에 실패했습니다.");

            const data: RecommendResult = await res.json();
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResult(null);
        setError(null);
    };

    return { result, loading, error, fetchRecommend, reset };
}