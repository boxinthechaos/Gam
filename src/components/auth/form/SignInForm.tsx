import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthInput from "../AuthInput";
import PasswordInput from "../PasswordInput";
import AuthButton from "../AuthButton";
import AuthLinks from "../AuthLinks";

export default function SignInForm(){
    const [nickName, setNickName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

    const isInfoValid: boolean = nickName.trim().length > 0 && password.trim().length > 0;

    const nav = useNavigate();

    return(
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
            value={nickName}
            placeholder="닉네임"
            onChange={(e) => setNickName(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
            />

            <PasswordInput
            password={password}
            onChange={(e) => setPassword(e.target.value)}
            isPasswordShown={isPasswordShown}
            onClick={() => setIsPasswordShown(!isPasswordShown)}
            animation="animate-[appear_0.5s_ease-out_0.2s_forwards]"
            />

            <AuthButton isInfoValid={isInfoValid} text="로그인"/>

            <div className="flex justify-center w-full">
                <AuthLinks
                    links={[
                        { label: "닉네임 찾기", onClick: () => nav('/verify') },
                        { label: "비밀번호 재설정", onClick: () => nav('/verify') },
                        { label: "회원가입", onClick: () => nav('/verify') },
                    ]}
                />
            </div>
            
        </div>
    );
}