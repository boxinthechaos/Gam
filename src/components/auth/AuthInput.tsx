import type { AuthInputProps } from "../../types/AuthInputProps";

export default function AuthInput({ nickName, onChange }: AuthInputProps) {
    return (
        <input 
        type="text" 
        placeholder="닉네임"
        value={nickName} 
        onChange={onChange}
        className="opacity-0 animate-[appear_0.5s_ease-out_0.1s_forwards] auth-input"
        />
    );
}