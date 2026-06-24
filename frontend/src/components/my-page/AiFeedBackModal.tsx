import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";

import type { AiFeedBackModalProps } from "../../types/AiFeedBackModalProps";

export default function AIFeedbackModal({ tripId, onClose }: AiFeedBackModalProps) {
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/v1/travel/feedback/trips/${tripId}`, { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) throw new Error("피드백을 가져오지 못했습니다.");
                setFeedback(await res.text());
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [tripId]);

    return createPortal(
        <div
            className="
                fixed inset-0 z-50 
                flex items-center justify-center
                bg-black/40"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >

            <div className="
                flex flex-col
                w-full max-w-md max-h-130
                border border-gray-100 rounded-2xl shadow-sm 
                bg-white
                overflow-hidden"
            >

                {/* 헤더 */}
                <div className="
                    flex items-center justify-between shrink-0 
                    px-5 py-4 
                    border-b border-gray-100"
                >

                    <div className="flex items-center gap-2">

                        <Sparkles 
                        size={15} 
                        className="text-[#ff8c00]" 
                        />

                        <span className="text-sm font-medium text-gray-900">
                            AI 일정 피드백
                        </span>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            flex items-center justify-center
                            w-7 h-7  
                            border-none rounded-lg
                            bg-transparent
                            text-gray-400 
                            transition-colors cursor-pointer

                            hover:bg-gray-100"
                        aria-label="닫기"
                    >
                        <X size={15} />
                    </button>

                </div>

                {/* 바디 */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {loading && (
                        <div className="
                            flex flex-col items-center gap-3 
                            py-10"
                        >

                            <div className="
                                w-6 h-6 
                                border-2 border-orange-100 border-t-[#ff8c00] rounded-full  
                                animate-spin" 
                            />

                            <p className="text-sm text-gray-400">
                                AI가 일정을 분석 중입니다...
                            </p>

                        </div>
                    )}

                    {error && (
                        <p className="py-8 text-sm text-red-400 text-center">
                            {error}
                        </p>
                    )}

                    {feedback && (
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {feedback}
                        </p>
                    )}

                </div>

                {/* 푸터 */}
                {!loading && (
                    <div className="shrink-0 px-5 pb-5 ">
                        <button
                            onClick={onClose}
                            className="
                                w-full 
                                py-2.5 
                                border-none rounded-xl 
                                bg-[#ff8c00] 
                                text-white text-sm font-medium
                                transition-colors cursor-pointer
                                
                                hover:bg-[#e67e00] "
                        >
                            확인
                        </button>
                    </div>
                )}

            </div>

        </div>,
        document.body
    );
}