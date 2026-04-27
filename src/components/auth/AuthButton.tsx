import type { AuthButtonProps } from "../../types/AuthButtonProps";

export default function AuthButton({ isInfoValid, text }: AuthButtonProps) {
    return (
        <button 
        disabled={!isInfoValid} 
        className={`
            opacity-0 
            animate-[appear_0.5s_ease-out_0.3s_forwards]
            auth-btn
            w-full h-10 
            mt-2
            text-base

            md:h-12 md:text-lg

            ${isInfoValid 
                ? "auth-btn-able" 
                : "auth-btn-disabled"
            }   
        `}
        >
            {text}
        </button>
    );
}