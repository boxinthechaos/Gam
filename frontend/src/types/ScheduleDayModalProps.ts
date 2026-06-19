import type { Schedule } from "./MyPageTypes";

export interface ScheduleDayModalProps {
    date: string;
    schedules: Schedule[];
    onClose: () => void;
}