import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RequestingCode from "./verifying-code/RequestingCode";
import VerifyingCode from "./verifying-code/VerifyingCode";
import AuthLinks from "../AuthLinks";

export default function VerifyingForm() {
    const nav = useNavigate();
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

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

            <RequestingCode 
                email={email}
                setEmail={setEmail}
                onCodeSent={() => setCodeSent(true)} 
            />

            {codeSent && <VerifyingCode email={email}/>}

            <div className="flex justify-end w-full">
                <AuthLinks
                    links={[
                        { label: "로그인 페이지로 이동", onClick: () => nav('/sign-in') },
                    ]}
                    animation="animate-[appear_0.5s_ease-out_0.3s_forwards]"
                />
            </div>
        </div>
    );
}