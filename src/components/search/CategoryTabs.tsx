import { Utensils, Building2, Camera } from "lucide-react";

import type { CategoryTabsProps } from "../../types/CategoryTabsProps";
import type { Category } from "../../types/SearchTypes";

const TABS: { value: Category; label: string; Icon: React.ElementType }[] = [
    { value: "food",  label: "식당",  Icon: Utensils  },
    { value: "hotel", label: "숙소",  Icon: Building2 },
    { value: "tour",  label: "관광지", Icon: Camera    },
];

export default function CategoryTabs({ category, onChange }: CategoryTabsProps) {
    return (
        <div className="flex gap-2 mb-3">

            {TABS.map(({ value, label, Icon }) => {
                const active = category === value;
                return (
                    <button
                        key={value}
                        onClick={() => onChange(value)}
                        className={`
                            opacity-0
                            flex-1 flex flex-col items-center gap-1
                            py-3 rounded-xl 
                            border 
                            text-xs font-medium
                            transition-all duration-150 cursor-pointer

                            animate-[appear_0.5s_ease-out_0.1s_forwards]
                            ${active
                                ? "border-[#ff8c00] text-[#ff8c00] bg-orange-50"
                                : "border-gray-200 text-gray-400 bg-white hover:bg-gray-50"
                            }
                        `}
                    >

                        <Icon size={18} />
                        {label}
                        
                    </button>
                );
            })}

        </div>
    );
}