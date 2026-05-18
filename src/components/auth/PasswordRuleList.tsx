// PasswordRuleList.tsx
import { Check, X } from "lucide-react";

import type { PasswordRuleListProps } from "../../types/PasswordRuleListProps";

const PASSWORD_RULES = [
    { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
    { label: "영문자 A~z", test: (pw: string) => /[a-zA-Z]/.test(pw) },
    { label: "숫자 0~9", test: (pw: string) => /[0-9]/.test(pw) },
    {
        label: `특수문자 (사용 가능한 특수문자 : ! " # $ % & ' ( ) * + , – . / : ; < = > ? @ [ ₩ ] ^ _ \` { | } ~)`,
        test: (pw: string) => /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(pw),
    },
];

export default function PasswordRuleList({ password }: PasswordRuleListProps) {
    const ruleResults = PASSWORD_RULES.map((rule) => rule.test(password));

    return (
        <ul className="opacity-0 mt-2 mb-4 space-y-1 text-sm animate-[appear_0.5s_ease-out_0.2s_forwards]">

            {PASSWORD_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">

                    {ruleResults[idx]
                        ? <Check size={16} className="mt-0.5 text-green-500 shrink-0" />
                        : <X size={16} className="mt-0.5 text-red-500 shrink-0" />
                    }

                    <span className={ruleResults[idx] ? "text-green-600" : "text-red-500"}>
                        {rule.label}
                    </span>

                </li>
            ))}

        </ul>
    );
}