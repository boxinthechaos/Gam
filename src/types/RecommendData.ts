import {
    Heart, Users, User, Home,
    Waves, Mountain, Building2, Landmark,
    Coffee, ChefHat, SportShoe, Leaf,
    Bus, Car,
} from "lucide-react";

import type { OptionGroup } from "../types/RecommendTypes";

export const OPTION_GROUPS: OptionGroup[] = [
    {
        key: "companion",
        title: "누구랑 가나요?",
        options: [
            { label: "연인",  Icon: Heart   },
            { label: "친구",  Icon: Users   },
            { label: "혼자",  Icon: User    },
            { label: "가족",  Icon: Home    },
        ],
    },
    {
        key: "scenery",
        title: "어떤 풍경이 좋나요?",
        options: [
            { label: "밤바다", Icon: Waves },
            { label: "푸른 산", Icon: Mountain },
            { label: "화려한 도심", Icon: Building2 },
            { label: "고즈넉한 역사", Icon: Landmark },
        ],
    },
    {
        key: "style",
        title: "여행 스타일은?",
        options: [
            { label: "감성카페", Icon: Coffee },
            { label: "돼지런한 먹방", Icon: ChefHat },
            { label: "짜릿한 액티비티", Icon: SportShoe },
            { label: "조용한 힐링", Icon: Leaf },
        ],
    },
    {
        key: "transport",
        title: "이동 수단은?",
        options: [
            { label: "대중교통", Icon: Bus },
            { label: "자차 드라이브", Icon: Car },
        ],
    },
];