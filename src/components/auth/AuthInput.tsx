import type { AuthInputProps } from "../../types/AuthInputProps";

export default function AuthInput({ value, placeholder, onChange, animation }: AuthInputProps) {
    return (
        <input 
        type="text" 
        placeholder={placeholder}
        value={value} 
        onChange={onChange}
        className={`opacity-0 ${animation} auth-input w-full`}
        />
    );
}