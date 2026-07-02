import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, UserRoundX, Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../types/NavData";

import AlertWindow from "../windows/AlertWindow";
import SelectionWindow from "../windows/SelectionWindow";

import logo from "../../assets/gam-logo.png"

import axios from "axios";

export default function Navbar() {
    const [windowOpen, setWindowOpen] = useState<boolean>(false);
    const [windowMessage, setWindowMessage] = useState<string>("");
    const [windowType, setWindowType] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState<boolean>(false); // 모바일 드로어

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const nav = useNavigate();
    const location = useLocation();

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

    const handleSignOut = async () => {
        try {
            await axios.post(
                "/api/v1/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            setWindowOpen(false);
            nav("/sign-in");
        } catch (error) {
            setWindowOpen(false);

            setAlertMessage("로그아웃 도중 오류가 발생했습니다.");
            setIsAlertOpen(true);
        }
    }

    const handleUserDelete = async () => {
        try {
            await axios.post(
                "/api/v1/auth/withdraw",
                {},
                {
                    withCredentials: true,
                }
            );

            setWindowOpen(false);
            nav("/sign-in");
        } catch (error) {
            setWindowOpen(false);

            setAlertMessage("회원탈퇴 도중 오류가 발생했습니다.");
            setIsAlertOpen(true);
        }
    }

    const handleConfirm = () =>{
        if (windowType == "signOut") {
            handleSignOut();
        }
        if (windowType == "userDelete") {
            handleUserDelete();
        }
    }

    const handleNavClick = (path: string) => {
        nav(path);
        setMenuOpen(false); // 이동 후 드로어 닫기
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

                {/* 데스크탑 네비 링크 — 모바일에서 숨김 */}
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

                {/* 우측 버튼 영역 */}
                <div className="flex items-center gap-2">

                    {/* 로그아웃 — 모바일: 아이콘만 / 데스크탑: 텍스트 포함 */}
                    <button
                        onClick={() => signOutWindow()}
                        className="
                            flex items-center gap-1.5 
                            p-2
                            rounded-full border border-gray-300 
                            bg-transparent 
                            text-xs font-semibold text-gray-700 

                            md:px-4
                            md:py-2 
                            md:text-sm

                            hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="로그아웃"
                    >
                        <LogOut size={14} />
                        <span className="hidden md:inline">로그아웃</span>
                    </button>

                    {/* 회원탈퇴 — 모바일: 아이콘만 / 데스크탑: 텍스트 포함 */}
                    <button
                        onClick={() => userDeleteWindow()}
                        className="
                            flex items-center gap-1.5 
                            p-2
                            rounded-full border border-gray-300 
                            bg-transparent 
                            text-xs font-semibold text-red-600

                            md:py-2 
                            md:px-4
                            md:text-sm

                            hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="회원탈퇴"
                    >
                        <UserRoundX size={14} />
                        <span className="hidden md:inline">회원탈퇴</span>
                    </button>

                    {/* 햄버거 메뉴 — 모바일에서만 표시 */}
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="
                            md:hidden
                            flex items-center justify-center
                            w-9 h-9
                            rounded-lg border border-gray-200
                            bg-transparent text-gray-700
                            cursor-pointer transition-colors
                            hover:bg-gray-100"
                        aria-label="메뉴 열기"
                    >
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                </div>

            </div>

            {/* 모바일 드로어 — 오버레이 + 배경 어둡게 */}
            {menuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-60 bg-black/40"
                    onClick={() => setMenuOpen(false)}
                >
                    <div
                        className="
                            absolute top-0 left-0 right-0
                            bg-white border-b border-gray-100
                            shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 드로어 헤더 — 로고 + 닫기 */}
                        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
                            <img src={logo} className="h-8 w-auto object-contain" />
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="
                                    flex items-center justify-center
                                    w-9 h-9 rounded-lg
                                    bg-transparent border-none text-gray-700
                                    cursor-pointer hover:bg-gray-100 transition-colors"
                                aria-label="메뉴 닫기"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* 링크 목록 */}
                        <div className="flex flex-col">
                            {NAV_LINKS.map((l) => {
                                const active = location.pathname === l.path;
                                return (
                                    <button
                                        key={l.label}
                                        onClick={() => handleNavClick(l.path)}
                                        className={`
                                            px-5 py-4 text-left
                                            border-b border-gray-50 last:border-none
                                            text-base cursor-pointer
                                            bg-transparent border-l-0 border-r-0 border-t-0
                                            transition-colors
                                            ${active
                                                ? "text-[#ff8c00] font-semibold bg-orange-50"
                                                : "text-gray-700"
                                            }
                                        `}
                                    >
                                        {l.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {windowOpen && (
                <SelectionWindow
                    message={windowMessage}
                    onConfirm={handleConfirm}
                    onCancel={() => setWindowOpen(false)}
                />
            )}

            {isAlertOpen && (
                <AlertWindow
                    message={alertMessage}
                    onClose={() => setIsAlertOpen(false)}
                />
            )}

        </nav>
    );
}