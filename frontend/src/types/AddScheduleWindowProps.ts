import type { Place } from "./SearchTypes";

export interface AddScheduleWindowProps {
    place: Place;          // 추가할 장소 (식당/숙소/관광지)
    onClose: () => void;
    onSaved?: () => void;   // 저장 성공 후 콜백 (예: 토스트, 리스트 갱신 등)
    onError?: (msg: string) => void; // 저장 실패 시 부모에게 전달
}