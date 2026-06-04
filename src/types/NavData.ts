import { Map, Sparkles, CalendarDays, Music } from "lucide-react";
import type { ElementType } from "react";

export interface NavLink {
    label: string;
    path: string;
}

export interface FeatureCardData {
    tag: string;
    tagClass: string;
    linkClass: string;
    title: string;
    desc: string;
    Icon: ElementType;
    img: string;
    path: string;
    colSpan?: string;
    animation: string;
}

export const NAV_LINKS: NavLink[] = [
    { label: "지도 검색", path: "" },
    { label: "AI 스케줄", path: "" },
    { label: "내 여행", path: "" },
    { label: "플레이리스트", path: "" },
];

export const FEATURE_CARDS: FeatureCardData[] = [
    {
        tag: "MAP SEARCH",
        tagClass: "text-blue-600",
        linkClass: "text-blue-600",
        title: "지도 검색",
        desc: "세계 지도에서 원하는 여행지를 탐색하고 숨겨진 명소를 발견하세요.",
        Icon: Map,
        img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80",
        path: "",
        animation: "animate-[appear_0.5s_ease-out_0.6s_forwards]"
    },
    {
        tag: "AI TRAVEL SCHEDULE",
        tagClass: "text-[#ff8c00]",
        linkClass: "text-[#ff8c00]",
        title: "AI 맞춤 스케줄",
        desc: "AI가 당신의 취향과 일정을 분석해 완벽한 여행 코스를 짜드립니다.",
        Icon: Sparkles,
        img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
        path: "",
        animation: "animate-[appear_0.5s_ease-out_0.7s_forwards]"
    },
    {
        tag: "MY TRAVEL SCHEDULE",
        tagClass: "text-emerald-600",
        linkClass: "text-emerald-600",
        title: "내 여행 스케줄",
        desc: "직접 날짜별 일정을 작성하고 여행의 모든 순간을 계획해 보세요.",
        Icon: CalendarDays,
        img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80",
        path: "",
        animation: "animate-[appear_0.5s_ease-out_0.8s_forwards]"
    },
    {
        tag: "TRAVEL PLAYLIST",
        tagClass: "text-rose-600",
        linkClass: "text-rose-600",
        title: "여행 플레이리스트",
        desc: "여행지 분위기에 딱 맞는 음악을 큐레이션하고 특별한 여정을 완성하세요.",
        Icon: Music,
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        path: "",
        colSpan: "col-start-1 col-end-2 row-start-2",
        animation: "animate-[appear_0.5s_ease-out_0.9s_forwards]"
    },
];