import type { Schedule } from "./MyPageTypes";

export interface EditScheduleWindowProps {
    tripId: number;
    schedule: Schedule;
    onClose: () => void;
    onSaved: () => void;
    onError: (msg: string) => void;
}