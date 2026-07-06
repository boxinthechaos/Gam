import type { Schedule } from "./MyPageTypes";

export interface ScheduleDayModalProps {
    tripId: number;
    date: string;
    schedules: Schedule[];
    onClose: () => void;
    onEditSaved: () => void;
}