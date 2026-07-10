export interface Trip {
    id: number;
    title: string;
    startDate: string; // "2026-07-01"
    endDate: string;
    scheduleCount: number;
}

export interface Schedule {
    id: number;
    placeName: string;
    category: string;
    visitDate: string;
    startTime: string;
    endTime?: string;
    lat?: number;
    lng?: number;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    spotifyUrl?: string;
}

export interface Playlist {
    id: number;
    title: string;
    songs: Song[];
}

export type SidebarView =
    | { type: "trip";     data: Trip }
    | { type: "playlist"; data: Playlist };

export type TripTab = "calendar" | "list" | "map";