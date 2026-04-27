import { useNavigate } from "react-router-dom";

import RequestingCode from "../verifying-code/RequestingCode";
import VerifyingCode from "../verifying-code/VerifyingCode";
import AuthLinks from "../AuthLinks";

export default function VerifyingForm() {
    const nav = useNavigate();

    return (
        <div className="
            w-full max-w-md mx-auto px-5
            md:max-w-lg"
        >
            
            <p className="
                auth-text mb-6 
                md:mb-10"
            >
                이메일을 입력해주세요.
            </p>

            <RequestingCode/>

            <VerifyingCode/>

            <div className="flex justify-end w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                    ]}
                />
            </div>

        </div>
    );
}