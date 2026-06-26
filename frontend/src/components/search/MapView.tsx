import { useEffect, useRef } from "react";

import type { MapViewProps } from "../../types/MapViewProps";

export default function MapView({ places, selected }: MapViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const infoWindowRef = useRef<any>(null);

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
                            center: new window.kakao.maps.LatLng(
                                37.566826,
                                126.9786567
                            ),
                            level: 5,
                        }
                    );

                    console.log("카카오맵 생성 완료");

                    // 생성 시점에 컨테이너 크기가 0이거나 아직 자리잡지 않은 경우
                    // 지도가 빈 화면으로 보이는 문제 방지 (relayout으로 강제 재계산)
                    setTimeout(() => mapRef.current?.relayout(), 0);
                });
            }
        }, 100);

        // 컨테이너 크기가 바뀔 때마다(레이아웃 변경, 창 크기 조절 등) 지도 재계산
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
        if (!map) return;

        const { kakao } = window as any;

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        infoWindowRef.current?.close();

        if (places.length === 0) return;

        const bounds = new kakao.maps.LatLngBounds();

        places.forEach((place) => {
            const pos = new kakao.maps.LatLng(place.lat, place.lng);
            const marker = new kakao.maps.Marker({ map, position: pos, title: place.name });

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
    }, [places]);

    // selected 변경 시 해당 위치로 이동
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selected) return;

        const { kakao } = window as any;
        map.setCenter(new kakao.maps.LatLng(selected.lat, selected.lng));
        map.setLevel(3);
    }, [selected]);

    return (
        <div className="
            opacity-0 
            relative w-full h-full 
            animate-[appear_0.5s_ease-out_0.3s_forwards]"
        >

            <div ref={containerRef} className="w-full h-full" />

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