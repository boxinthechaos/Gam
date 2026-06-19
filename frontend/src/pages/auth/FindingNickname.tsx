import { useNavigate } from "react-router-dom";

import NicknameCard from "../../components/auth/NicknameCard";
import AuthLinks from "../../components/auth/AuthLinks";

export default function FindingNickname() {
    const nav = useNavigate();

    return (
        <div className="page">
            
            <div>

                <p className="auth-text mb-2">
                    아이디를 찾았어요!
                </p>

                <p className="
                    opacity-0 
                    text-[#AAAAAA] text-sm 
                    animate-[appear_0.5s_ease-out_0.1s_forwards]

                    md:text-base"
                >
                    인증된 이메일과 연결된 아이디입니다.
                </p>

                <NicknameCard/>

                <div className="flex justify-center w-full">
                    <AuthLinks
                        links={[
                            { label: "로그인 페이지로 가기", onClick: () => nav('/sign-in') },
                            { label: "비밀번호 재설정", onClick: () => nav('/verify') },
                        ]}
                        animation="animate-[appear_0.5s_ease-out_0.3s_forwards]"
                    />
                </div>

            </div>

        </div>
    );
}