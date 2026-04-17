import type { AuthLinksProps } from "../../types/AuthLinksProps";

export default function AuthLinks({ links }: AuthLinksProps) {
    return (
        <div
        className="
            opacity-0 animate-[appear_0.5s_ease-out_0.4s_forwards] 
            flex justify-center items-center 
            w-full 
            mt-5 
            text-xs 
            md:text-base"
        >
            {links.map((link, index) => (
                <div key={index} className="flex items-center">
                    <p
                    onClick={link.onClick}
                    className="cursor-pointer hover:underline"
                    >
                        {link.label}
                    </p>

                    {index < links.length - 1 && (
                        <p className="mx-2 text-xs text-[#AAAAAA]">|</p>
                    )}
                </div>
            ))}
        </div>
    );
}