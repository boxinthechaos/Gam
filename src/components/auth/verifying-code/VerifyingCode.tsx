import { useState } from "react";

import AuthInput from "../AuthInput";
import AuthButton from "../AuthButton";

export default function VerifyingCode() {
    const [code, setCode] = useState<string>("");

    const isCodeValid: boolean = code.trim().length > 0;

    return (
        <div>

            <AuthInput
            value={code}
            placeholder="코드"
            onChange={(e) => setCode(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.2s_forwards]"
            />

            <AuthButton
            isInfoValid={isCodeValid}
            text="인증하기"
            />

        </div>
    );
}