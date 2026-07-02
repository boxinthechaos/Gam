import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordForm } from "../../../../hooks/usePasswordForm";

import type { SetPasswordFormProps } from "../../../../types/SetPasswordFormProps";

import AuthButton from "../../AuthButton";
import AuthLinks from "../../AuthLinks";
import PasswordFormFields from "../PasswordFormField";
import AlertWindow from "../../../windows/AlertWindow";

import axios from "axios";

export default function SetPasswordForm({ nickname, email }: SetPasswordFormProps) {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

    const nav = useNavigate();

    // 회원가입 핸들러 추가
    const handleSignUp = async () => {
        if (!isPasswordValid) return;

         try {
            await axios.post(
                "/api/v1/auth/join",
                {
                    email,
                    nickname,
                    password,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            setIsSignUpSuccess(true);
            setAlertMessage("회원가입이 완료되었습니다.");
            setIsAlertOpen(true);

            sessionStorage.removeItem("verifiedEmail");
        } catch (error: any) {
            const message = "회원가입 중 오류가 발생했습니다.";

            setIsSignUpSuccess(false);
            setAlertMessage(message);
            setIsAlertOpen(true);
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
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.5s_forwards]"
                />
            </div>

            {isAlertOpen && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => {
                        setIsAlertOpen(false);

                        if (isSignUpSuccess) {
                            nav("/sign-in");
                        }
                    }}
                />
            )}
            
        </div>
    );
}