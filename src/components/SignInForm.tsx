import { useState } from "react";

import show from "../assets/show.png";
import noshow from "../assets/noshow.png";

export default function SignInForm(){
    const [nickName, setNickName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

    const isInfoValid:boolean = nickName.trim().length > 0 && password.trim().length > 0;

    return(
        <div className="w-160 h-auto px-5">

            <p className="opacity-0 animate-appear auth-text">
                안녕하세요 :)
            </p>

            <p className="
                opacity-0 animate-appear auth-text mb-8 
                md:mb-10 
                lg:mb-15"
            >
                로그인하고 감과 함께 떠나볼까요?
            </p>

            <form>

                <input 
                type="text" 
                placeholder="닉네임"
                value={nickName} 
                onChange={(e) => setNickName(e.target.value)}
                className="opacity-0 auth-input animate-appear2"
                />

                <div className="opacity-0 animate-appear3 relative">

                    <input 
                    type={isPasswordShown ? "text" : "password"}
                    placeholder="비밀번호" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    />

                    <img 
                        src={isPasswordShown ? show : noshow} 
                        onClick={() => setIsPasswordShown(!isPasswordShown)}
                        className="
                            absolute right-3 top-4 
                            w-4 
                            cursor-pointer
                            md:top-5 md:w-6
                            lg:top-6 -translate-y-1/2"
                    />

                </div>

                <button 
                disabled={!isInfoValid} 
                className={`
                    ${isInfoValid ? "orange-btn cursor-pointer" : "gray-btn"} 
                        opacity-0 
                        auth-btn 
                        animate-appear4
                    `}
                >
                    로그인
                </button>

            </form>

            <div 
            className="
                opacity-0 animate-appear5 
                flex justify-center items-center 
                w-full 
                mt-5 
                text-xs 
                md:text-base"
            >

                <p className="cursor-pointer">닉네임 찾기</p>

                <p className="mx-2 text-xs text-[#AAAAAA]">|</p>

                <p className="cursor-pointer">비밀번호 재설정</p>

                <p className="mx-2 text-xs text-[#AAAAAA]">|</p>

                <p className="cursor-pointer">회원가입</p>

            </div>

        </div>
    );
}