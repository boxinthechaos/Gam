import { useState } from "react";
import axios from "axios";

import AlertWindow from "../../../windows/AlertWindow";

interface Props {
    onCodeSent: () => void;
    email: string;
    setEmail: (value: string) => void;
}

export default function RequestingCode({ onCodeSent, email, setEmail }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const isEmailValid: boolean = email.trim().length > 0;

    const handleSend = async (): Promise<void> => {
        if (!isEmailValid) return;
        setLoading(true);
        try {
            await axios.post(
                "/api/v1/auth/email/send",
                { email },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            onCodeSent();
        } catch (e: unknown) {
            const msg = "이메일 전송에 실패했습니다.";
            setAlertMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                    disabled={!isEmailValid || loading}
                    className={`
                        auth-btn w-[25%] h-8 text-xs
                        md:h-10 md:text-base
                        ${isEmailValid && !loading ? "auth-btn-able" : "auth-btn-disabled"}
                    `}
                >
                    {loading ? "전송 중..." : "코드 발송"}
                </button>
            </div>

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>
    );
}