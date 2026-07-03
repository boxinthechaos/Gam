import type { Place } from "./SearchTypes";

export interface AddScheduleWindowProps {
    place: Place;
    onClose: () => void;
    onSaved?: () => void;
    onError?: (msg: string) => void;
}