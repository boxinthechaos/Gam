import type { ChangeEvent } from "react";

interface Props {
    type: string;
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    animation: string;
}

export default function AuthInput({ type, value, placeholder, onChange, animation }: Props) {
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