import type { FeatureCardData } from "./NavData";

export type FeatureCardProps = {
    card: FeatureCardData;
    hovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    animation: string;
}