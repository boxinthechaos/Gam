import { useState } from "react";
import { FEATURE_CARDS } from "../../types/NavData";
import FeatureCard from "./FeatureCard";

export default function FeatureGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div>

            <div className="
                opacity-0
                flex items-center gap-4
                max-w-6xl mx-auto 
                px-4 pb-6 
                animate-[appear_0.5s_ease-out_0.5s_forwards]
                
                md:px-8
                md:pb-8"
            >

                <div className="flex-1 h-px bg-black/10" />

                <span className="text-xs font-medium text-gray-400 tracking-wide whitespace-nowrap">
                    서비스 메뉴
                </span>

                <div className="flex-1 h-px bg-black/10" />

            </div>

            <section className="max-w-6xl mx-auto px-4 pb-16 md:px-8 md:pb-20">
                {/* 모바일 1열 → 태블릿 2열 → 데스크탑 3열 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {FEATURE_CARDS.map((card, i) => (
                        <FeatureCard
                            key={card.tag}
                            card={card}
                            hovered={hoveredIndex === i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animation={card.animation}
                        />
                    ))}
                </div>

            </section>

        </div>
    );
}