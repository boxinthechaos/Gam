import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";

import type { CreateTripForm } from "../types/CreateTripForm";

import Navbar from "../components/main-page/NavBar";

import { useCreateTrip } from "../hooks/useCreateTrip";

export default function TripCreate() {
    const nav = useNavigate();
    const { createTrip, loading, error } = useCreateTrip();

    const [form, setForm] = useState<CreateTripForm>({
        title: "",
        startDate: "",
        endDate: "",
    });

    const isValid =
        form.title.trim().length > 0 &&
        form.startDate.length > 0 &&
        form.endDate.length > 0 &&
        form.startDate <= form.endDate;

    const handleChange = (key: keyof CreateTripForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!isValid) return;
        const ok = await createTrip(form);
        if (ok) nav("/my-page");
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="
                flex flex-1 items-center justify-center 
                px-4 py-10"
            >
                <div className="w-full max-w-sm">

                    {/* 헤더 */}
                    <div className="opacity-0 mb-7 animate-[appear_0.5s_ease-out_0.1s_forwards]">
                        <h1 className="mb-1 text-lg font-bold text-gray-900">
                            새 여행 만들기
                        </h1>
                        <p className="text-sm text-gray-400">
                            여행 정보를 입력해주세요.
                        </p>
                    </div>

                    {/* 여행 제목 */}
                    <div className="opacity-0 mb-4 animate-[appear_0.5s_ease-out_0.2s_forwards]">
                        <label className="mb-1.5 block text-xs text-gray-500">
                            여행 제목
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="예: 즐거운 제주도 여행"
                            className="
                                w-full 
                                px-3.5 py-2.5
                                border border-gray-200 rounded-xl
                                text-sm text-gray-700 bg-gray-50
                                outline-none transition-all

                                focus:border-[#ff8c00] 
                                focus:ring-2 
                                focus:ring-orange-100"
                        />
                    </div>

                    {/* 날짜 */}
                    <div className="opacity-0 mb-6 animate-[appear_0.5s_ease-out_0.3s_forwards]">
                        <label className="mb-1.5 block text-xs text-gray-500">
                            날짜
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                className="
                                    w-full px-3 py-2.5
                                    border border-gray-200 rounded-xl
                                    text-sm text-gray-700 bg-gray-50
                                    outline-none transition-all

                                    focus:border-[#ff8c00] 
                                    focus:ring-2 
                                    focus:ring-orange-100"
                            />
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                                className="
                                    w-full px-3 py-2.5
                                    border border-gray-200 rounded-xl
                                    text-sm text-gray-700 bg-gray-50
                                    outline-none transition-all

                                    focus:border-[#ff8c00] 
                                    focus:ring-2 
                                    focus:ring-orange-100
                                    "
                            />
                        </div>
                    </div>

                    {/* 에러 */}
                    {error && (
                        <p className="text-xs text-red-400 mb-3">
                            {error}
                        </p>
                    )}

                    {/* 생성 버튼 */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className={`
                            opacity-0
                            flex items-center justify-center gap-2
                            w-full 
                            py-3 
                            rounded-xl border-none
                            text-sm font-semibold
                            transition-all cursor-pointer
                            animate-[appear_0.5s_ease-out_0.4s_forwards]

                            ${isValid && !loading
                                ? "bg-[#ff8c00] text-white hover:bg-[#e67e00]"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }
                        `}
                    >
                        {loading
                            ? "생성 중..."
                            : <><Plane size={15} /> 여행 생성하기</>
                        }
                    </button>
                </div>
            </main>
        </div>
    );
}