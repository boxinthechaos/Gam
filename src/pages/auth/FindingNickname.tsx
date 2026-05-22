import { useNavigate } from "react-router-dom";

import NicknameCard from "../../components/auth/NicknameCard";
import AuthLinks from "../../components/auth/AuthLinks";

export default function FindingNickname() {
    const nav = useNavigate();

    return (
        <div className="flex justify-center items-center w-screen h-screen">
            
            <div>

                <p className="auth-text mb-2">
                    닉네임을 찾았어요!
                </p>

                <p className="opacity-0 animate-[appear_0.5s_ease-out_0.1s_forwards] text-[#AAAAAA] ">
                    인증된 이메일과 연결된 닉네임입니다.
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