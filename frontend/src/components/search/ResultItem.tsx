import { useState } from "react";
import { Plus, Check, Utensils, Building2, Camera } from "lucide-react";

import type { Place } from "../../types/SearchTypes";

import AddScheduleWindow from "../windows/AddScheduleWindow";
import AlertWindow from "../windows/AlertWindow";

interface Props {
    place: Place;
    isAdded: boolean;
    onToggleAdd: (place: Place) => void;
    onSelect: (place: Place) => void;
}

const ICON_MAP = {
    food: { Icon: Utensils, bg: "bg-orange-100", color: "text-[#ff8c00]", tag: "식당", tagStyle: "bg-orange-50 text-orange-500"   },
    hotel: { Icon: Building2, bg: "bg-blue-100", color: "text-blue-500", tag: "숙소", tagStyle: "bg-blue-50 text-blue-500"       },
    tour: { Icon: Camera, bg: "bg-emerald-100", color: "text-emerald-500", tag: "관광지", tagStyle: "bg-emerald-50 text-emerald-600"  },
};

export default function ResultItem({ place, isAdded, onToggleAdd, onSelect }: Props) {
    const { Icon, bg, color, tag, tagStyle } = ICON_MAP[place.category];

    const [windowOpen, setWindowOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    return (
        <>
            <div
                onClick={() => onSelect(place)}
                className="
                    flex items-center gap-3
                    p-3 mb-2
                    border border-gray-100 rounded-xl
                    bg-white cursor-pointer
                    hover:border-[#ff8c00] transition-colors duration-150"
            >
                <div className={`
                    flex shrink-0 items-center justify-center
                    w-9 h-9 rounded-lg
                    ${bg}`
                }>
                    <Icon size={17} className={color} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{place.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{place.address}</p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${tagStyle}`}>
                        {tag}
                    </span>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); setWindowOpen(true); }}
                    className={`
                        flex shrink-0 items-center justify-center
                        w-7 h-7
                        border rounded-lg
                        transition-all duration-150 cursor-pointer
                        ${isAdded
                            ? "border-[#ff8c00] bg-orange-50 text-[#ff8c00]"
                            : "border-gray-200 bg-white text-gray-400 hover:border-[#ff8c00] hover:text-[#ff8c00]"
                        }
                    `}
                    aria-label={isAdded ? "추가됨" : "일정 추가"}
                >
                    {isAdded ? <Check size={14} /> : <Plus size={14} />}
                </button>
            </div>

            {windowOpen && (
                <AddScheduleWindow
                    place={place}
                    onClose={() => setWindowOpen(false)}
                    onSaved={() => onToggleAdd(place)}
                    onError={(msg: string) => {
                        setWindowOpen(false);
                        setAlertMessage(msg);
                    }}
                />
            )}

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>
    );
}