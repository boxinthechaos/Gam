import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { usePasswordForm } from "../../../../hooks/usePasswordForm";

import AuthButton from "../../AuthButton";
import AuthLinks from "../../AuthLinks";
import PasswordFormFields from "../PasswordFormField";
import AlertWindow from "../../../windows/AlertWindow";

export default function SetPasswordFormForm({ nickname }: { nickname: string }) {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const nav = useNavigate();

    const handleSignUp = async (): Promise<void> => {
        if (!isPasswordValid) return;

        const email = sessionStorage.getItem("email");
        if (!email) {
            setAlertMessage("이메일 인증이 필요합니다.");
            return;
        }

        try {
            await axios.post(
                "/api/v1/auth/join",
                { email, nickname, password },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            sessionStorage.removeItem("email");
            setAlertMessage("회원가입이 완료되었습니다.");
        } catch (e: unknown) {
            const msg =
                axios.isAxiosError(e) && e.response?.data
                    ? e.response.data
                    : "회원가입에 실패했습니다.";
            setAlertMessage(msg);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-5 md:max-w-lg">
            <p className="auth-text mb-6 md:mb-10">
                비밀번호를 입력해주세요.
            </p>

            <PasswordFormFields
                password={password}
                passwordAgain={passwordAgain}
                onPasswordChange={setPassword}
                onPasswordAgainChange={setPasswordAgain}
            />

            <AuthButton
                isInfoValid={isPasswordValid}
                text="회원가입"
                func={handleSignUp}
                animation="animate-[appear_0.5s_ease-out_0.4s_forwards]"
            />

            <div className="flex justify-end w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav("/sign-in") },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.5s_forwards]"
                />
            </div>

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => {
                        if (alertMessage === "회원가입이 완료되었습니다.") {
                            nav("/sign-in");
                        }
                        setAlertMessage(null);
                    }}
                />
            )}
        </div>
    );
}