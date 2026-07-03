import { useEffect, useRef, useState } from "react";

import type { MapViewProps } from "../../types/MapViewProps";

const MARKER_COLOR: Record<string, string> = {
    food: "#ff8c00",
    hotel: "#3b82f6",
    tour: "#10b981",
};

function createMarkerImage(kakao: any, color: string) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
                fill="${color}" />
            <circle cx="16" cy="16" r="7" fill="white" />
        </svg>
    `;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    return new kakao.maps.MarkerImage(url, new kakao.maps.Size(32, 40), {
        offset: new kakao.maps.Point(16, 40),
    });
}

export default function MapView({ places, selected }: MapViewProps) {
    const containerRef  = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const infoWindowRef = useRef<any>(null);
    const [mapReady, setMapReady] = useState<boolean>(false);  // 타이밍 문제 해결

    // 지도 초기화
    useEffect(() => {
        const timer = setInterval(() => {
            if (window.kakao?.maps && containerRef.current) {
                clearInterval(timer);

                window.kakao.maps.load(() => {
                    if (mapRef.current) return;

                    mapRef.current = new window.kakao.maps.Map(
                        containerRef.current,
                        {
                            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
                            level: 5,
                        }
                    );

                    setTimeout(() => {
                        mapRef.current?.relayout();
                        setMapReady(true);  // 지도 준비 완료 신호
                    }, 0);
                });
            }
        }, 100);

        const resizeObserver = new ResizeObserver(() => {
            mapRef.current?.relayout();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            clearInterval(timer);
            resizeObserver.disconnect();
        };
    }, []);

    // places 변경 시 마커 재렌더링
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady) return;  // mapReady 의존성 추가

        const { kakao } = window as any;

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        infoWindowRef.current?.close();

        if (places.length === 0) return;

        const bounds = new kakao.maps.LatLngBounds();

        places.forEach((place) => {
            const pos = new kakao.maps.LatLng(place.lat, place.lng);
            const markerImage = createMarkerImage(kakao, MARKER_COLOR[place.category] ?? "#888888");
            const marker = new kakao.maps.Marker({
                map,
                position: pos,
                title: place.name,
                image: markerImage,
            });

            const infoWindow = new kakao.maps.InfoWindow({
                content: `
                    <div style="padding:8px 12px;font-size:13px;font-weight:500;color:#111;white-space:nowrap;">
                        ${place.name}
                        <div style="font-size:11px;color:#888;margin-top:2px;">${place.address}</div>
                    </div>
                `,
            });

            kakao.maps.event.addListener(marker, "click", () => {
                infoWindowRef.current?.close();
                infoWindow.open(map, marker);
                infoWindowRef.current = infoWindow;
            });

            markersRef.current.push(marker);
            bounds.extend(pos);
        });

        map.setBounds(bounds);
    }, [places, mapReady]);  // mapReady 의존성 추가

    // selected 변경 시 해당 위치로 이동
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selected || !mapReady) return;

        const { kakao } = window as any;
        map.setCenter(new kakao.maps.LatLng(selected.lat, selected.lng));
        map.setLevel(3);
    }, [selected, mapReady]);

    return (
        <div className="
            opacity-0
            relative w-full h-full
            animate-[appear_0.5s_ease-out_0.3s_forwards]"
        >
            <div ref={containerRef} className="w-full h-full" />

            {/* 범례 */}
            <div className="
                absolute top-4 left-4
                flex flex-col gap-1.5
                px-3 py-2.5
                bg-white border border-gray-100 rounded-xl shadow-sm"
            >
                {[
                    { label: "식당",   color: "#ff8c00" },
                    { label: "숙소",   color: "#3b82f6" },
                    { label: "관광지", color: "#10b981" },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <svg width="10" height="13" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill={color} />
                            <circle cx="16" cy="16" r="7" fill="white" />
                        </svg>
                        <span className="text-xs text-gray-500">{label}</span>
                    </div>
                ))}
            </div>

            {selected ? (
                <div className="
                    absolute bottom-4 right-4
                    px-4 py-3
                    bg-white border border-gray-100 rounded-xl shadow-sm
                    text-sm"
                >
                    <p className="font-medium text-gray-800">{selected.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selected.address}</p>
                </div>
            ) : (
                <div className="
                    absolute bottom-4 right-4
                    px-4 py-3
                    border border-gray-100 rounded-xl
                    bg-white
                    text-sm text-gray-400"
                >
                    장소를 선택하면 표시됩니다
                </div>
            )}
        </div>
    );
}