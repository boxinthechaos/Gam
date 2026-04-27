import { useState } from "react";

export default function RequestingCode() {
    const [email, setEmail] = useState<string>("");

    const isInfoValid: boolean = email.trim().length > 0;

    return (
        <div className="flex gap-2.5">

            <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="opacity-0 animate-[appear_0.5s_ease-out_0.1s_forwards] auth-input w-[75%]"
            />
            
            <button className={`
                opacity-0 
                animate-[appear_0.5s_ease-out_0.1s_forwards] 
                auth-btn
                w-[25%] h-8 

                md:h-10 md:text-base

                ${isInfoValid 
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