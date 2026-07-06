import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthInput from "../../AuthInput";
import AuthButton from "../../AuthButton";
import AlertWindow from "../../../windows/AlertWindow";

const CODE_DURATION_SECONDS = 300; // 5분

export default function VerifyingCode({ email }: { email: string }) {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState<number>(CODE_DURATION_SECONDS);

    const isExpired: boolean = secondsLeft <= 0;
    const isCodeValid: boolean = code.trim().length > 0 && !isExpired;

    const nav = useNavigate();

    // email이 바뀌거나(코드가 재발송되거나) 컴포넌트가 처음 마운트될 때 타이머 시작
    useEffect(() => {
        setSecondsLeft(CODE_DURATION_SECONDS);

        const timerId = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [email]);

    const formatTime = (totalSeconds: number): string => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const handleVerify = async (): Promise<void> => {
        if (!isCodeValid) return;
        setLoading(true);
        try {
            await axios.post(
                "/api/v1/auth/email/verify",
                { email, code },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (sessionStorage.getItem("verifyType") == "find-nickname"){
                nav('/find-nickname');
            }
            else if (sessionStorage.getItem("verifyType") == "reset-password"){
                nav('/reset-password');
            }
            else if (sessionStorage.getItem("verifyType") == "sign-up"){
                nav('/sign-up');
            }

            sessionStorage.removeItem("verifyType");

            sessionStorage.setItem("email", email);

        } catch (e: unknown) {
            const msg = "인증에 실패했습니다.";
            setAlertMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div>
                <div className="flex items-center gap-2">
                    <AuthInput
                        type="text"
                        value={code}
                        placeholder="코드"
                        onChange={(e) => setCode(e.target.value)}
                        animation="animate-[appear_0.5s_ease-out_0s_forwards]"
                    />
                    <span className="text-red-500 text-sm font-medium tabular-nums whitespace-nowrap">
                        {isExpired ? "시간 만료" : formatTime(secondsLeft)}
                    </span>
                </div>

                {isExpired && (
                    <p className="text-red-500 text-xs mt-1">
                        인증 코드가 만료되었습니다. 코드를 다시 요청해주세요.
                    </p>
                )}

                <AuthButton
                    func={handleVerify}
                    isInfoValid={isCodeValid && !loading}
                    text={loading ? "인증 중..." : "인증하기"}
                    animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
                />
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