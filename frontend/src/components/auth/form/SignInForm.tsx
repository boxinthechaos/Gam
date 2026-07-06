import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthInput from "../AuthInput";
import PasswordInput from "../PasswordInput";
import AuthButton from "../AuthButton";
import AuthLinks from "../AuthLinks";
import AlertWindow from "../../windows/AlertWindow";

export default function SignInForm() {
    const [nickname, setNickname] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const isInfoValid: boolean = nickname.trim().length > 0 && password.trim().length > 0;

    const nav = useNavigate();

    const handleLogin = async (): Promise<void> => {
        try {
            await axios.post(
                "/api/v1/auth/login",
                { nickname, password },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            nav("/main");
        } catch (e: unknown) {
            const msg = "로그인 도중 오류가 발생했습니다.";
            setAlertMessage(msg);
        }
    };

    return (
        <div className="
            w-full max-w-md mx-auto px-5
            md:max-w-lg"
        >
            <p className="auth-text">
                안녕하세요 :)
            </p>

            <p className="
                auth-text mb-6
                md:mb-10"
            >
                로그인하고 감과 함께 떠나볼까요?
            </p>

            <AuthInput
                type="text"
                value={nickname}
                placeholder="닉네임"
                onChange={(e) => setNickname(e.target.value)}
                animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
            />

            <PasswordInput
                password={password}
                onChange={(e) => setPassword(e.target.value)}
                isPasswordShown={isPasswordShown}
                onClick={() => setIsPasswordShown(!isPasswordShown)}
                animation="animate-[appear_0.5s_ease-out_0.2s_forwards]"
            />

            <AuthButton
                isInfoValid={isInfoValid}
                text="로그인"
                func={handleLogin}
                animation="animate-[appear_0.5s_ease-out_0.3s_forwards]"
            />

            <div className="flex justify-center w-full">
                <AuthLinks
                    links={[
                        { label: "닉네임 찾기", onClick: () => {
                            nav("/verify");
                            sessionStorage.setItem("verifyType", "find-nickname");
                        } },
                        { label: "비밀번호 재설정", onClick: () => {
                            nav("/verify");
                            sessionStorage.setItem("verifyType", "reset-password");
                        } },
                        { label: "회원가입", onClick: () => {
                            nav("/verify")
                            sessionStorage.setItem("verifyType", "sign-up");
                        } },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.4s_forwards]"
                />
            </div>

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}

        </div>
    );
}