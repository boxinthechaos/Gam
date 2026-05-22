export default function NicknameCard() {
    return (
        <div className="opacity-0 animate-[appear_0.5s_ease-out_0.2s_forwards] border border-[#FFEDD8] rounded-[18px] bg-white mt-10 mb-4 px-24 py-8 shadow-sm">

            <div className="text-center">

                <p className="text-[#FF8C00] text-[20px] font-medium mb-8">
                    내 닉네임
                </p>

                <h2 className="text-[60px] leading-none font-extrabold text-black mb-10">
                    사용자 이름
                </h2>

                <div className="w-full h-[1px] bg-[#ececec] mb-8" />

                <p className="text-[16px] text-[#b0b0b0]">
                    a01067220266@gmail.com으로 인증 됨
                </p>

            </div>

        </div>
    );
}