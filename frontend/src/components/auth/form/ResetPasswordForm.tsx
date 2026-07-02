import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordForm } from "../../../hooks/usePasswordForm";

import AuthButton from "../AuthButton";
import AuthLinks from "../AuthLinks";
import PasswordFormFields from "./PasswordFormField";
import AlertWindow from "../../windows/AlertWindow";

import axios from "axios";

export default function ResetPasswordForm() {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isResetSuccess, setIsResetSuccess] = useState(false);

    const email = sessionStorage.getItem("verifiedEmail") ?? "";

    const nav = useNavigate();

    const handleResetPassword = async () => {
        if (!isPasswordValid) return;

        try {
            await axios.post(
                "/api/v1/auth/reset-password",
                {
                    email: email,
                    newPassword: password,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            sessionStorage.removeItem("verifiedEmail");

            setIsResetSuccess(true);
            setAlertMessage("비밀번호가 성공적으로 변경되었습니다.");
            setIsAlertOpen(true);
        } catch (error: any) {
            const message = "비밀번호 재설정 중 오류가 발생했습니다.";

            setIsResetSuccess(false);
            setAlertMessage(message);
            setIsAlertOpen(true);
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
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                        { label: "닉네임 찾기", onClick: () => {
                                nav('/verify');
                                sessionStorage.setItem("verifyType", "find-nickname");
                            } 
                        },
                        { label: "회원가입", onClick: () => {
                                nav('/verify');
                                sessionStorage.setItem("verifyType", "sign-up");
                            } 
                        },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.5s_forwards]"
                />
            </div>

            {isAlertOpen && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => {
                        setIsAlertOpen(false);

                        if (isResetSuccess) {
                            nav("/sign-in");
                        }
                    }}
                />
            )}

        </div>
    );
}