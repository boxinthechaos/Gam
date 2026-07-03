import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthInput from "../../AuthInput";
import AuthButton from "../../AuthButton";
import AlertWindow from "../../../windows/AlertWindow";

export default function VerifyingCode({ email }: { email: string }) {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const isCodeValid: boolean = code.trim().length > 0;

    const nav = useNavigate();

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
                <AuthInput
                    type="text"
                    value={code}
                    placeholder="코드"
                    onChange={(e) => setCode(e.target.value)}
                    animation="animate-[appear_0.5s_ease-out_0s_forwards]"
                />
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