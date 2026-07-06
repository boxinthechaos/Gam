import type { AuthLinkItem } from "../../types/AuthLinkItem";

interface Props {
    links: AuthLinkItem[];
    animation: string;
};

export default function AuthLinks({ links, animation }: Props) {
    return (
        <div
        className={`
            opacity-0 ${animation} 
            flex 
            mt-5 
            text-xs 
            md:text-base`}
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