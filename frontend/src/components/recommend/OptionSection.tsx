import type { OptionGroup, RecommendForm } from "../../types/RecommendTypes";
import OptionCard from "../recommend/OptionCard";

interface Props {
    group: OptionGroup;
    selected: string | null;
    onSelect: (key: keyof RecommendForm, label: string) => void;
}

export default function OptionSection({ group, selected, onSelect }: Props) {
    return (
        <div className="opacity-0 mb-6 animate-[appear_0.5s_ease-out_0.2s_forwards]">
            <p className="text-xs text-gray-400 mb-2.5">{group.title}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {group.options.map((opt) => (
                    <OptionCard
                        key={opt.label}
                        option={opt}
                        selected={selected === opt.label}
                        onClick={() => onSelect(group.key, opt.label)}
                    />
                ))}
            </div>
        </div>
    );
}