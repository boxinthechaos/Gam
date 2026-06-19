import type { Place } from "./SearchTypes";

export interface ResultItemProps {
    place: Place;
    isAdded: boolean;
    onToggleAdd: (place: Place) => void;
    onSelect: (place: Place) => void;
}