import type { AuthInputProps } from "../../types/AuthInputProps";

export default function AuthInput({ type, value, placeholder, onChange, animation }: AuthInputProps) {
    return (
        <input 
        type={type} 
        placeholder={placeholder}
        value={value} 
        onChange={onChange}
        className={`opacity-0 ${animation} auth-input w-full`}
        />
    );
}