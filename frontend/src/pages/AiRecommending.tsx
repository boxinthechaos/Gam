import { useState } from "react";
import { Sparkles } from "lucide-react";

import Navbar from "../components/main-page/NavBar";
import OptionSection from "../components/recommend/OptionSection";
import ResultCard from "../components/recommend/ResultCard";

import { OPTION_GROUPS } from "../types/RecommendData";
import { useRecommend } from "../hooks/useRecommend";
import type { RecommendForm } from "../types/RecommendTypes";

const INITIAL_FORM: RecommendForm = {
    companion: null,
    scenery: null,
    style: null,
    transport: null,
};

export default function AiRecommending() {
    const [form, setForm] = useState<RecommendForm>(INITIAL_FORM);
    const { result, loading, error, fetchRecommend, reset } = useRecommend();

    const isAllSelected = Object.values(form).every((v) => v !== null);

    const handleSelect = (key: keyof RecommendForm, label: string) => {
        setForm((prev) => ({ ...prev, [key]: label }));
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        reset();
    };

    const handleSubmit = () => {
        if (isAllSelected) fetchRecommend(form);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="
                flex-1
                w-full max-w-xl mx-auto
                px-4 py-8

                md:px-0"
            >
                {/* 헤더 */}
                <div className="opacity-0 mb-8 animate-[appear_0.5s_ease-out_0.1s_forwards]">
                    <h1 className="mb-1 text-xl font-bold text-gray-900">
                        AI 맞춤 여행지 추천
                    </h1>
                    <p className="text-sm text-gray-400">
                        취향을 선택하면 AI가 최적의 여행지를 추천해드립니다.
                    </p>
                </div>

                {/* 옵션 섹션들 */}
                {OPTION_GROUPS.map((group) => (
                    <OptionSection
                        key={group.key}
                        group={group}
                        selected={form[group.key]}
                        onSelect={handleSelect}
                    />
                ))}

                {/* 추천 받기 버튼 */}
                <button
                    onClick={handleSubmit}
                    disabled={!isAllSelected || loading}
                    className={`
                        opacity-0
                        flex items-center justify-center gap-2
                        w-full 
                        mt-2 py-3.5 
                        border-none rounded-xl 
                        text-sm font-bold
                        transition-all duration-150 cursor-pointer
                        animate-[appear_0.5s_ease-out_0.3s_forwards]

                        ${isAllSelected && !loading
                            ? "bg-[#ff8c00] text-white hover:bg-[#e67e00]"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }
                    `}
                >
                    {loading
                        ? <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            AI가 분석 중입니다...
                          </span>
                        : <><Sparkles size={15} /> AI 추천 받기</>
                    }
                </button>

                {/* 에러 */}
                {error && (
                    <p className="text-xs text-red-400 text-center mt-3">{error}</p>
                )}

                {/* 결과 */}
                {result && (
                    <ResultCard result={result} onReset={handleReset} />
                )}

            </main>

        </div>
    );
}