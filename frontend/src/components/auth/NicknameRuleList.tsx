import { Check, X } from "lucide-react";

const NICKNAME_RULES = [
    { label: "4자 이상", test: (v: string) => v.trim().length >= 4 },
];

export default function NicknameRuleList({ nickname }: { nickname: string }) {
    return (
        <ul className="
            opacity-0 
            mt-2 mb-4 space-y-1 
            text-xs 
            animate-[appear_0.5s_ease-out_0.2s_forwards] 
            
            md:text-sm"
        >

            {NICKNAME_RULES.map((rule, idx) => {
                const ok = rule.test(nickname);
                return (
                    <li key={idx} className="flex items-start gap-2">

                        {ok
                        ? <Check size={16} className="mt-0.5 text-green-500 shrink-0" />
                        : <X     size={16} className="mt-0.5 text-red-500  shrink-0" />
                        }

                        <span className={ok ? "text-green-600" : "text-red-500"}>
                            {rule.label}
                        </span>

                    </li>
                );
            })}

        </ul>
    );
}