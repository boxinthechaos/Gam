export interface TripDayOption {
    dayLabel: string;   // "1일차"
    date: string;       // "2026-07-01"
}

// 여행 시작일~종료일 사이의 모든 날짜를 "N일차" 형태로 생성
export function getTripDayOptions(startDate: string, endDate: string): TripDayOption[] {
    const result: TripDayOption[] = [];
    const cur = new Date(startDate);
    const end = new Date(endDate);
    let day = 1;

    while (cur <= end) {
        result.push({
            dayLabel: `${day}일차`,
            date: cur.toISOString().split("T")[0],
        });
        cur.setDate(cur.getDate() + 1);
        day += 1;
    }

    return result;
}