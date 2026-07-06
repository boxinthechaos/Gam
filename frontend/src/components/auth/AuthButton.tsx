interface Props {
    isInfoValid: boolean;
    text: string;
    func?: () => void;
    animation: string
}

export default function AuthButton({ isInfoValid, text, func, animation }: Props) {
    return (
        <button 
        onClick={func}
        disabled={!isInfoValid} 
        className={`
            opacity-0 
            ${animation}
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