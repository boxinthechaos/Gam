import { useState } from "react";
import type { CreateTripForm } from "../types/CreateTripForm";

export function useCreateTrip() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTrip = async (form: CreateTripForm): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/v1/travel/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("여행 생성에 실패했습니다.");
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createTrip, loading, error };
}