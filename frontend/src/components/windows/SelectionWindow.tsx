import { createPortal } from "react-dom";

interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function SelectionWindow({ message, onConfirm, onCancel }: Props) {
    return createPortal(
        <div className="
            flex items-center justify-center
            fixed inset-0 z-50 
            bg-black/40"
        >

            <div className="
                opacity-0 
                w-full max-w-sm
                mx-2 p-8 pb-6
                border border-black/8 rounded-2xl
                bg-white     
                animate-[appear_0.5s_ease-out_0s_forwards]
                
                md:mx-0"
            >

                <p className="
                    mb-8 
                    text-xl font-bold text-gray-900 leading-relaxed"
                >
                    {message}
                </p>

                <div className="flex justify-end gap-2.5">

                    <button
                        onClick={onConfirm}
                        className="
                            px-6 py-2.5 
                            border-none rounded-lg 
                            bg-[#ff8c00] 
                            text-white text-[15px] font-semibold  
                            
                            hover:brightness-90 transition-all cursor-pointer"
                    >
                        예
                    </button>

                    <button
                        onClick={onCancel}
                        className="
                            px-6 py-2.5 
                            border border-gray-300
                            rounded-lg  
                            bg-white 
                            text-gray-500 text-[15px] font-semibold 
                            
                            hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        아니오
                    </button>

                </div>

            </div>

        </div>,
        document.body
    );
}