export interface TripDayOption {
    date: string;
    dayLabel: string;
}

export function getTripDayOptions(startDate: string, endDate: string): TripDayOption[] {
    const options: TripDayOption[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    let current = new Date(start);
    let day = 1;

    while (current <= end) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, "0");
        const dd = String(current.getDate()).padStart(2, "0");

        options.push({
            date: `${yyyy}-${mm}-${dd}`,
            dayLabel: `${day}일차`,
        });

        current.setDate(current.getDate() + 1);
        day++;
    }

    return options;
}