import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthInput from "../../AuthInput";
import AuthButton from "../../AuthButton";
import AuthLinks from "../../AuthLinks";
import PasswordRuleList from "../../PasswordRuleList";

const PASSWORD_RULES = [
  { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
  { label: "영문자 A~z", test: (pw: string) => /[a-zA-Z]/.test(pw) },
  { label: "숫자 0~9", test: (pw: string) => /[0-9]/.test(pw) },
  {
    label: `특수문자 ...`,
    test: (pw: string) => /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(pw),
  },
];

export default function PasswordSettingForm({ nickname }: { nickname: string }) {
    const [password, setPassword] = useState<string>("");
    const [passwordAgain, setPasswordAgain] = useState<string>("");

    const isPasswordValid: boolean =
        PASSWORD_RULES.every((rule) => rule.test(password)) &&
        password === passwordAgain &&
        passwordAgain.length > 0;

    const nav = useNavigate();

    return (
        <div className="w-full max-w-md mx-auto px-5 md:max-w-lg">

            <p className="auth-text mb-6 md:mb-10">
                비밀번호를 입력해주세요.
            </p>

            <AuthInput
            type="text"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
            />

            <PasswordRuleList password={password} /> {/* ← 한 줄로 대체 */}

            <AuthInput
            type="text"
            value={passwordAgain}
            placeholder="비밀번호 재입력"
            onChange={(e) => setPasswordAgain(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.3s_forwards]"
            />

            {passwordAgain.length > 0 && password !== passwordAgain && (
                <p className="mt-1 text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
            )}

            <AuthButton 

            isInfoValid={isPasswordValid} 
            text="회원가입" 
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