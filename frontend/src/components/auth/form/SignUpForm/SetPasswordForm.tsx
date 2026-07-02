import { useNavigate } from "react-router-dom";
import { usePasswordForm } from "../../../../hooks/usePasswordForm";

import AuthButton from "../../AuthButton";
import AuthLinks from "../../AuthLinks";
import PasswordFormFields from "../PasswordFormField";

export default function SetPasswordFormForm({ nickname }: { nickname: string }) {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();
    const nav = useNavigate();

    // 회원가입 핸들러 추가
    const handleSignUp = async () => {
        if (!isPasswordValid) return;

        try {
            const response = await fetch("/api/v1/auth/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: nickname,  // 또는 email이면 이렇게
                    password: password
                }),
            });

            if (response.ok) {
                alert("회원가입 성공!");
                nav('/sign-in');
            }
        } catch (error) {
            console.error("회원가입 실패:", error);
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
        </div>
    );
}