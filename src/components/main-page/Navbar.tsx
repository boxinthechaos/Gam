import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { NAV_LINKS } from "../../types/NavData";

import SelectionWindow from "../windows/SelectionWindow";

import logo from "../../assets/gam-logo.png"

export default function Navbar() {
    const [windowOpen, setWindowOpen] = useState<boolean>(false);

    const nav = useNavigate();

    const handleSignOut = () => {
        setWindowOpen(false);
        nav('/sign-in');
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

                    <img src={logo} className="h-8 md:h-10 w-auto object-contain"/>

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

                <button
                    onClick={() => setWindowOpen(true)}
                    className="
                        flex items-center gap-1.5 
                        px-3 py-1.5 md:px-4 md:py-2 
                        rounded-full border border-gray-300 
                        bg-transparent 
                        text-xs md:text-sm font-semibold text-gray-700 
                        hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <LogOut size={13} />
                    로그아웃
                </button>

            </div>

            { windowOpen && 
            <SelectionWindow
            message="로그아웃을 하시겠습니까?"
            onConfirm={handleSignOut}
            onCancel={() => setWindowOpen(false)}
            /> }

        </nav>
    );
}