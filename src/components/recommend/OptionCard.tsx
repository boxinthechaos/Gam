import type { Option } from "../../types/RecommendTypes";

interface Props {
    option: Option;
    selected: boolean;
    onClick: () => void;
}

export default function OptionCard({ option, selected, onClick }: Props) {
    const { label, Icon } = option;

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center gap-2
                py-4 px-2
                rounded-xl border
                text-xs font-medium
                transition-all duration-150 cursor-pointer bg-white
                
                ${selected
                    ? "border-[#ff8c00] text-[#ff8c00] bg-orange-50 border-[1.5px]"
                    : "border-gray-200 text-gray-400 hover:bg-gray-50"
                }
            `}
        >

            <Icon size={22} />
            {label}

        </button>
    );
}