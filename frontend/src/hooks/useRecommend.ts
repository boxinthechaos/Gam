import { useState } from "react";
import axios from "axios";
import type { RecommendForm, RecommendResult } from "../types/RecommendTypes";

export function useRecommend() {
    const [result, setResult] = useState<RecommendResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommend = async (form: RecommendForm) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await axios.post<RecommendResult>(
                "/api/v1/travel/recommend",
                {
                    companion: form.companion,
                    scenery: form.scenery,
                    style: form.style,
                    transport: form.transport,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            setResult(res.data);
        } catch (e) {
            const msg =
                axios.isAxiosError(e) && e.response?.data?.message
                    ? e.response.data.message
                    : "추천 요청에 실패했습니다.";
            setError(msg);
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