import { useState } from "react";

interface Props {
    onCodeSent: () => void;
}

export default function RequestingCode({ onCodeSent }: Props) {
    const [email, setEmail] = useState<string>("");

    const isEmailValid: boolean = email.trim().length > 0;

    const handleSend = () => {
        if (!isEmailValid) return;
        // TODO: 실제 API 호출
        onCodeSent();
    };

    return (
        <div className="opacity-0 flex gap-3 animate-[appear_0.5s_ease-out_0.1s_forwards]">
            <input
                type="text"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input w-[75%]"
            />
            <button
                onClick={handleSend}
                disabled={!isEmailValid}
                className={`
                    auth-btn w-[25%] h-8 text-xs
                    md:h-10 md:text-base
                    ${isEmailValid ? "auth-btn-able" : "auth-btn-disabled"}
                `}
            >
                코드 발송
            </button>
        </div>
    );
}