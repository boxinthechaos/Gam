import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { NicknameFormProps } from "../../../../types/NicknameFormProps";

import AuthInput from "../../AuthInput";
import AuthButton from "../../AuthButton";
import AuthLinks from "../../AuthLinks";

export default function NicknameForm({ onNext }: NicknameFormProps) {
    const [nickname, setNickname] = useState<string>("");

    const isNicknameValid: boolean = nickname.trim().length > 0;

    const nav = useNavigate();

    return (
        <div className="
            w-full max-w-md mx-auto px-5
            md:max-w-lg"
        >

            <p className="
                auth-text mb-6 
                md:mb-10"
            >
                닉네임을 입력해주세요.
            </p>

            <AuthInput
            value={nickname}
            placeholder="닉네임"
            onChange={(e) => setNickname(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
            />

            <AuthButton
            func={() => onNext(nickname)}
            isInfoValid={isNicknameValid}
            text="다음"
            />

            <div className="flex justify-end w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                    ]}
                />
            </div>

        </div>
    );
}