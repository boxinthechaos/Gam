import { useEffect, useState } from "react";

import type { UserInfo } from "../../types/UserInfo";

import axios from "axios";


export default function NicknameCard() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get<UserInfo>(
                    "/api/v1/auth/user/email",
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );

                setUserInfo(response.data);
                
                sessionStorage.removeItem("verifiedEmail");
            } catch (error) {
                console.error("닉네임 조회 실패", error);
            }
        };

        getUserInfo();
    }, []);

    return (
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
                    md:text-[20px]
                ">
                    내 닉네임
                </p>

                <h2 className="
                    mb-4 text-[30px] leading-none font-extrabold text-black
                    md:mb-8
                    md:text-[50px]
                ">
                    {userInfo?.nickname ?? ""}
                </h2>

                <div className="
                    w-full h-px mb-4 bg-[#ececec]
                    md:mb-8
                    "
                />

                <p className="
                    text-[10px] text-[#b0b0b0]
                    md:text-[16px]
                    "
                >
                    {userInfo?.email ?? ""}으로 인증 됨
                </p>

            </div>

        </div>
    );
}