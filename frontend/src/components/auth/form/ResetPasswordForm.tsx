import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { usePasswordForm } from "../../../hooks/usePasswordForm";

import AuthButton from "../AuthButton";
import AuthLinks from "../AuthLinks";
import PasswordFormFields from "./PasswordFormField";
import AlertWindow from "../../windows/AlertWindow";

export default function ResetPasswordForm() {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const nav = useNavigate();

    const handleResetPassword = async (): Promise<void> => {
        if (!isPasswordValid) return;

        const email = sessionStorage.getItem("email");
        if (!email) {
            setAlertMessage("이메일 인증이 필요합니다.");
            return;
        }

        try {
            await axios.patch(
                "/api/v1/auth/reset-password",
                { email, newPassword: password },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            sessionStorage.removeItem("email");
            setAlertMessage("비밀번호가 재설정되었습니다.");
        } catch (e: unknown) {
            const msg = "비밀번호 재설정에 실패했습니다.";
            setAlertMessage(msg);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-5 md:max-w-lg">

            <p className="auth-text mb-6 md:mb-10">
                새 비밀번호를 입력해주세요.
            </p>

            <PasswordFormFields
                password={password}
                passwordAgain={passwordAgain}
                onPasswordChange={setPassword}
                onPasswordAgainChange={setPasswordAgain}
            />

            <AuthButton
                func={handleResetPassword}
                isInfoValid={isPasswordValid}
                text="비밀번호 재설정"
                animation="animate-[appear_0.5s_ease-out_0.4s_forwards]"
            />

            <div className="flex justify-center w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav("/sign-in") },
                        { label: "닉네임 찾기", onClick: () => {
                            sessionStorage.setItem("verifyType", "find-nickname");
                            nav("/verify");
                        }},
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.5s_forwards]"
                />
            </div>

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => {
                        if (alertMessage === "비밀번호가 재설정되었습니다.") {
                            nav("/sign-in");
                        }
                        setAlertMessage(null);
                    }}
                />
            )}

        </div>
    );
}