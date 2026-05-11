import { useState } from "react";

export default function RequestingCode() {
    const [email, setEmail] = useState<string>("");

    const isEmailValid: boolean = email.trim().length > 0;

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
            className={`
                auth-btn w-[25%] h-8 text-xs

                md:h-10 md:text-base

                ${isEmailValid
                    ? "auth-btn-able"
                    : "auth-btn-disabled"
                } 
            `}
            >
                코드 발송
            </button>

        </div>
    );
}