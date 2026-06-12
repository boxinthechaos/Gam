import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, UserRoundX } from "lucide-react";
import { NAV_LINKS } from "../../types/NavData";

import SelectionWindow from "../windows/SelectionWindow";

import logo from "../../assets/gam-logo.png"

export default function Navbar() {
    const [windowOpen, setWindowOpen] = useState<boolean>(false);
    const [windowMessage, setWindowMessage] = useState<string>("");
    const [windowType, setWindowType] = useState<string>("");

    const nav = useNavigate();

    const signOutWindow = () => {
        setWindowOpen(true);
        setWindowType("signOut")
        setWindowMessage("로그아웃 하시겠습니까?");
    }

    const userDeleteWindow = () => {
        setWindowOpen(true);
        setWindowType("userDelete")
        setWindowMessage("회원탈퇴를 하시겠습니까?\n회원님의 모든 데이터가 사라지게 됩니다!");
    }

    const handleSignOut = () => {
        setWindowOpen(false);
        nav('/sign-in');
    }

    const handleUserDelete = () => {
        setWindowOpen(false);
        nav('/sign-in');
    }

    const handleConfirm = () =>{
        if (windowType == "signOut") {
            handleSignOut();
        }
        if (windowType == "userDelete") {
            handleUserDelete();
        }
    }

    return (
        <nav className="
            sticky top-0 z-50 border-b 
            border-black/8
            bg-white backdrop-blur-md"
        >

                <div className="
                    opacity-0
                    flex items-center justify-between
                    max-w-6xl mx-auto h-14 
                    px-4 
                    animate-[appear_0.5s_ease-out_0s_forwards]
                    
                    md:h-16
                    md:px-8"
                >

                <button
                    onClick={() => nav("/main")}
                    className="
                        flex items-center gap-2.5 
                        p-0 
                        border-none bg-transparent 
                        cursor-pointer"
                >

                    <img src={logo} className="h-8 w-auto object-contain md:h-10"/>

                </button>

                {/* 모바일에서 숨김 */}
                <div className="hidden md:flex items-center gap-8">

                    {NAV_LINKS.map((l) => (
                        <button
                            key={l.label}
                            onClick={() => nav(l.path)}
                            className="
                                border-none p-0 bg-transparent
                                text-sm font-medium text-[#aaaaaa]
                                cursor-pointer transition-all duration-200

                                hover:text-gray-900 hover:underline underline-offset-4"
                        >
                            {l.label}
                        </button>
                    ))}

                </div>

                <div className="flex justify-between w-48 md:w-60">

                    <button
                        onClick={() => signOutWindow()}
                        className="
                            flex items-center gap-1.5 
                            px-3 py-1.5  
                            rounded-full border border-gray-300 
                            bg-transparent 
                            text-xs font-semibold text-gray-700 

                            md:px-4
                            md:py-2 
                            md:text-sm

                            hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <LogOut size={13} />
                        로그아웃
                    </button>

                    <button
                        onClick={() => userDeleteWindow()}
                        className="
                            flex items-center gap-1.5 
                            px-3 py-1.5  
                            rounded-full border border-gray-300 
                            bg-transparent 
                            text-xs font-semibold text-red-600

                            md:py-2 
                            md:px-4
                            md:text-sm

                            hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <UserRoundX size={13} />
                        회원탈퇴
                    </button>

                </div>

            </div>

            { windowOpen && 
            <SelectionWindow
            message={windowMessage}
            onConfirm={handleConfirm}
            onCancel={() => setWindowOpen(false)}
            /> }

        </nav>
    );
}