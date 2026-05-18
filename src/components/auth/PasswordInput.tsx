import type { PasswordInputProps } from "../../types/PasswordInputProps";

import show from "../../assets/show.png";
import noshow from "../../assets/noshow.png"

export default function PasswordInput({ password, onChange, isPasswordShown, onClick, animation }: PasswordInputProps) {
    return (
        <div className={`opacity-0 ${animation} relative`}>

            <input 
            type={isPasswordShown ? "text" : "password"}
            placeholder="비밀번호" 
            value={password}
            onChange={onChange}
            className="auth-input w-full"
            />

            <img 
            src={isPasswordShown ? show : noshow} 
            onClick={onClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 cursor-pointer
            md:w-5"
            />

        </div>
    )
}