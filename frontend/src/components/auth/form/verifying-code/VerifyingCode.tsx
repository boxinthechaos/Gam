import { useState, useEffect, useContext } from "react";
import { VerifyContext } from "../../../../context/VerifyContext";
import { useNavigate } from "react-router-dom";

import type { VerifyingCodeProps } from "../../../../types/VerifyingCodeProps";

import AuthInput from "../../AuthInput";
import AuthButton from "../../AuthButton";
import AlertWindow from "../../../windows/AlertWindow";

import axios from "axios";

export default function VerifyingCode({ email }: VerifyingCodeProps) {
    const type = useContext(VerifyContext);

    const [code, setCode] = useState<string>("");

    const [timeLeft, setTimeLeft] = useState(300);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const isCodeValid: boolean = code.trim().length > 0;

    const nav = useNavigate();

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    const handleVerify = async() => {
        if (!isCodeValid) return;

        try {
            await axios.post(
                "/api/v1/auth/email/verify",
                {
                    email: email,
                    code: code,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (type === "sign-up") {
                sessionStorage.setItem("verifiedEmail", email);
                nav("/sign-up");
            }

            if (type === "reset-password") {
                sessionStorage.setItem("verifiedEmail", email);
                nav("/reset-password");
            }

            if (type === "find-nickname") {
                nav("/find-nickname");
            }
            
            sessionStorage.removeItem("verifyType");
        } catch (error: any) {
            const message = "이메일 인증 중 오류가 발생했습니다.";

            setAlertMessage(message);
            setIsAlertOpen(true);
        }
    }

    return (
        <div>

            <AuthInput
                type="text"
                value={code}
                placeholder="코드"
                onChange={(e) => setCode(e.target.value)}
                animation="animate-[appear_0.5s_ease-out_0s_forwards]"
            />

            <p className="mt-2 text-right text-sm text-red-500 font-semibold">
                {minutes}:{seconds}
            </p>

            <AuthButton
                func={handleVerify}
                isInfoValid={isCodeValid}
                text="인증하기"
                animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
            />

            {isAlertOpen && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setIsAlertOpen(false)}
                />
            )}
            
        </div>
    );
}