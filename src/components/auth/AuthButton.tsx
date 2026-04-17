import type { AuthButtonProps } from "../../types/AuthButtonProps";

export default function AuthButton({ isInfoValid, text }: AuthButtonProps) {
    return (
        <button 
        disabled={!isInfoValid} 
        className={`
                opacity-0 
                animate-[appear_0.5s_ease-out_0.3s_forwards]
                auth-btn
                ${isInfoValid 
                    ? "bg-[#ff8c00] hover:bg-[#e67e00] active:scale-95 cursor-pointer" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }   
            `}
        >
            {text}
        </button>
    );
}