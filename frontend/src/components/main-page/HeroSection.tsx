import { useNavigate } from "react-router-dom";
import { Globe, Sparkles, MapPin } from "lucide-react";

export default function HeroSection() {
    const nav = useNavigate();

    return (
        <section className="
            relative
            max-w-6xl
            mx-auto px-4 
            pt-12 pb-10 
            
            md:px-8 
            md:pt-20
            md:pb-16
            "
        >
            <div 
            className="
                absolute top-10 right-4 
                w-60 h-60  
                rounded-full pointer-events-none
                    
                md:right-16 
                md:w-105
                md:h-105
            "
            style={{
                background: "radial-gradient(circle, rgba(255,140,0,0.18) 0%, rgba(255,140,0,0.04) 60%, transparent 80%)",
            }}
            />

            <div className="relative max-w-xl">

                <span className="
                    opacity-0
                    inline-flex items-center gap-1.5 
                    mb-5 px-3 py-1 
                    border border-black/15 rounded-full  
                    bg-white/70 
                    text-xs font-medium text-gray-500
                    animate-[appear_0.5s_ease-out_0.1s_forwards]
                    
                    md:mb-7
                    md:px-4
                    md:py-1.5 
                    md:text-sm"
                >

                    <Globe size={12} />
                    AI 기반 스마트 여행 플랫폼

                </span>

                <h1 className="
                    opacity-0
                    mb-4 
                    text-4xl font-black leading-[1.15] tracking-[-2px] text-gray-900 
                    animate-[appear_0.5s_ease-out_0.2s_forwards]
                    
                    md:mb-6
                    md:text-6xl"
                >

                    당신의 완벽한
                    <br />
                    <span className="text-[#ff8c00]">여행</span>을 설계하세요

                </h1>

                <p className="
                    opacity-0
                    mb-8 
                    text-base  text-gray-500 leading-relaxed
                    animate-[appear_0.5s_ease-out_0.3s_forwards]
                    
                    md:mb-10 
                    md:text-lg"
                >
                    여행 정리는
                    <br />
                    이제부터 <span className="text-[#ff8c00]">감</span>에서.
                </p>

                <div className="flex items-center gap-2 flex-wrap md:gap-3">

                    <button
                        onClick={() => nav("/ai")}
                        className="
                            opacity-0
                            inline-flex items-center gap-2 
                            px-5 py-3  
                            border-none rounded-full 
                            bg-[#ff8c00] 
                            text-white text-sm  font-bold  
                            cursor-pointer 
                            animate-[appear_0.5s_ease-out_0.4s_forwards]

                            hover:bg-[#e67e00] transition-colors
                            
                            md:px-7
                            md:py-3.5
                            md:text-[15px]"
                    >

                        <Sparkles size={14} />
                        AI 스케줄 시작하기

                    </button>

                    <button
                        onClick={() => nav("/search")}
                        className="
                            opacity-0
                            inline-flex items-center gap-2 
                            px-5 py-3 
                            border border-black/15 rounded-full 
                            bg-white 
                            text-gray-900 text-sm font-semibold  
                            cursor-pointer
                            animate-[appear_0.5s_ease-out_0.4s_forwards] 

                            hover:bg-gray-50 transition-colors
                            
                            md:px-7
                            md:py-3.5 
                            md:text-[15px]"
                    >

                        <MapPin size={14} />
                        지도로 탐색하기

                    </button>

                </div>

            </div>

        </section>
    );
}