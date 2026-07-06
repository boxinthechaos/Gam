import { createPortal } from "react-dom";

interface Props {
    message: string;
    onClose: () => void;
}

export default function AlertWindow({ message, onClose }: Props) {
    return createPortal(
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
            "
        >
            <div
                className="
                    opacity-0
                    w-full max-w-sm
                    mx-2 p-8 pb-6
                    border border-black/8 rounded-2xl
                    bg-white
                    animate-[appear_0.5s_ease-out_0s_forwards]

                    md:mx-0
                "
            >
                <p
                    className="
                        mb-8
                        text-xl font-bold text-gray-900 leading-relaxed
                    "
                >
                    {message}
                </p>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="
                            px-6 py-2.5
                            border-none rounded-lg
                            bg-[#ff8c00]
                            text-white text-[15px] font-semibold

                            hover:brightness-90
                            transition-all
                            cursor-pointer
                        "
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}