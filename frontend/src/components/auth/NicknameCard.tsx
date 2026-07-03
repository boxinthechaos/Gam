import { useState, useEffect } from "react";
import axios from "axios";

import AlertWindow from "../windows/AlertWindow";

interface UserInfo {
    nickname: string;
    email: string;
}

export default function NicknameCard() {
    const [userInfo, setUserInfo]         = useState<UserInfo | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        const email = sessionStorage.getItem("email");

        axios
            .get<UserInfo>("/api/v1/auth/user/email", {
                params: { email },
                withCredentials: true,
            })
            .then((res) => setUserInfo(res.data))
            .catch((e: unknown) => {
                const msg = "닉네임을 가져오지 못했습니다.";
                setAlertMessage(msg);
            });
    }, []);

    return (
        <>
            <div className="
                opacity-0
                mt-10 mb-4 px-12 py-4
                border border-[#FFEDD8] rounded-[18px]
                bg-white shadow-sm
                animate-[appear_0.5s_ease-out_0.2s_forwards]

                md:mt-10
                md:mb-4
                md:px-30
                md:py-8"
            >
                <div className="text-center">

                    <p className="
                        mb-4 text-[#FF8C00] text-[12px] font-medium
                        md:mb-8
                        md:text-[20px]"
                    >
                        내 닉네임
                    </p>

                    <h2 className="
                        mb-4 text-[30px] leading-none font-extrabold text-black
                        md:mb-8
                        md:text-[50px]"
                    >
                        {userInfo?.nickname ?? "-"}
                    </h2>

                    <div className="
                        w-full h-px mb-4 bg-[#ececec]
                        md:mb-8"
                    />

                    <p className="
                        text-[10px] text-[#b0b0b0]
                        md:text-[16px]"
                    >
                        {userInfo?.email ?? "-"}으로 인증 됨
                    </p>

                </div>
            </div>

            {alertMessage && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>
    );
}