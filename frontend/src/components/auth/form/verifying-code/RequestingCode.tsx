import { useState } from "react";

import type { RequestingCodeProps } from "../../../../types/RequestingCodeProps";

import AlertWindow from "../../../windows/AlertWindow";

import axios from "axios";

export default function RequestingCode({ email, setEmail, onCodeSent }: RequestingCodeProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const isEmailValid: boolean = email.trim().length > 0;

    const handleSend = async () => {
        if (!isEmailValid) return;

        try {
            await axios.post(
                "/api/v1/auth/email/send",
                {
                    email: email,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            onCodeSent();
        } catch (error: any) {
            const message = "인증 코드 발송에 실패했습니다.";

            setAlertMessage(message);
            setIsAlertOpen(true);
        }
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
            {isAlertOpen && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setIsAlertOpen(false)}
                />
            )}
        </div>
    );
}