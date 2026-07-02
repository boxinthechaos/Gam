import type { Schedule } from "./MyPageTypes";

export interface NotionCalendarProps {
    schedules: Schedule[];
    tripStart: string;
    tripEnd: string;
    tripId: number; 
    onEditSaved: () => void;
}