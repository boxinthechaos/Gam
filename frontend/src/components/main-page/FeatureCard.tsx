import { useNavigate } from "react-router-dom";
import type { FeatureCardProps } from "../../types/FeatureCardProps";

export default function FeatureCard({ card, hovered, onMouseEnter, onMouseLeave, animation }: FeatureCardProps) {
    const nav = useNavigate();
    const { Icon } = card;

    return (
        <button
        onClick={() => nav(card.path)}
        className={[
            "opacity-0 flex flex-col bg-white rounded-2xl text-inherit text-left overflow-hidden",
            "transition-all duration-300 p-0 border-none shadow-sm cursor-pointer",
            hovered ? "-translate-y-1 shadow-xl" : "",
            card.colSpan ?? "",
            animation ?? ""]
            .filter(Boolean)
            .join(" ")
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        >
      
            <div className="relative w-full h-40 overflow-hidden md:h-48">

                <img
                src={card.img}
                alt={card.title}
                className="block w-full h-full object-cover"
                />

                <div className="
                    flex items-center justify-center
                    absolute bottom-3.5 left-3.5 
                    w-10 h-10 
                    rounded-full shadow-md
                    bg-white"
                >

                    <Icon size={18} className={card.tagClass} />

                </div>

            </div>

      
            <div className="flex flex-col flex-1 gap-2 p-5 pb-6">

                <span className={`text-[10px] font-bold tracking-widest uppercase ${card.tagClass}`}>
                    {card.tag}
                </span>

                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight m-0">
                    {card.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed flex-1 m-0">
                    {card.desc}
                </p>

                <span className={`text-sm font-semibold mt-1 ${card.linkClass}`}>
                    시작하기 →
                </span>

            </div>

      </button>
  );
}