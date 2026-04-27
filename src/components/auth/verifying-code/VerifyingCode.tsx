import { useState } from "react";

import AuthInput from "../AuthInput"
import AuthButton from "../AuthButton"

export default function VerifyingCode() {
    const [code, setCode] = useState<string>("");
    
    const isInfoValid: boolean = code.trim().length >= 6;

    return (
        <div>
            
            <AuthInput 
            placeholder="인증코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            animation="animate-[appear_0.5s_ease-out_0.2s_forwards]"
            />
            
            <AuthButton 
            isInfoValid={isInfoValid}
            text="인증하기" 
            />

        </div>
    )
}