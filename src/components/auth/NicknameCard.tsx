export default function NicknameCard() {
    return (
        <div className="
            opacity-0 
            mt-10 mb-4 px-5 py-4
            border border-[#FFEDD8] rounded-[18px] 
            bg-white shadow-sm 
            animate-[appear_0.5s_ease-out_0.2s_forwards]
            
            md:mt-10
            md:mb-4
            md:px-30
            md:py-8"
        >

            <div className="text-center">

                <p className="
                    mb-4 text-[#FF8C00] text-[12px] font-medium
                    md:mb-8
                    md:text-[20px]
                ">
                    내 닉네임
                </p>

                <h2 className="
                    mb-4 text-[30px] leading-none font-extrabold text-black
                    md:mb-8
                    md:text-[50px]
                ">
                    사용자 이름
                </h2>

                <div className="
                    w-full h-[1px] mb-4 bg-[#ececec]
                    md:mb-8
                    "
                />

                <p className="
                    text-[10px] text-[#b0b0b0]
                    md:text-[16px]
                    "
                >
                    a01067220266@gmail.com으로 인증 됨
                </p>

            </div>

        </div>
    );
}