import { useNavigate } from "react-router-dom";
import { usePasswordForm } from "../../../hooks/usePasswordForm";

import AuthButton from "../AuthButton";
import AuthLinks from "../AuthLinks";
import PasswordFormFields from "./PasswordFormField";

export default function ResetPasswordForm() {
    const { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid } = usePasswordForm();
    const nav = useNavigate();

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
            
            isInfoValid={isPasswordValid} 
            text="비밀번호 재설정" 
            animation="animate-[appear_0.5s_ease-out_0.4s_forwards]"
            />
            
            <div className="flex justify-center w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                        { label: "닉네임 찾기", onClick: () => nav('/verify') },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.5s_forwards]"
                />
            </div>

        </div>
    );
}