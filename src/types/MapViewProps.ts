import type { Place } from "./SearchTypes";

export interface MapViewProps {
    places: Place[];
    selected: Place | null;
}