import type { ElementType } from "react";

export interface Option {
    label: string;
    Icon: ElementType;
}

export interface OptionGroup {
    key: keyof RecommendForm;
    title: string;
    options: Option[];
}

export interface RecommendForm {
    companion: string | null;
    scenery:   string | null;
    style:     string | null;
    transport: string | null;
}

export interface RecommendResult {
    recommendedRegion: string;
    reason: string;
}