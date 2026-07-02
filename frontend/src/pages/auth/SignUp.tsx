import { useState } from "react";

import NicknameForm from "../../components/auth/form/SignUpForm/NicknameForm";
import SetPasswordForm from "../../components/auth/form/SignUpForm/SetPasswordForm";

export default function SignUp() {
    const [step, setStep] = useState<"nickname" | "password">("nickname");
    const [nickname, setNickname] = useState<string>("");

    const email = sessionStorage.getItem("verifiedEmail") ?? "";

    const handleNicknameSubmit = (value: string) => {
        setNickname(value);
        setStep("password");
    };

    return (
        <div className="page">
            {step === "nickname" && (
                <NicknameForm onNext={handleNicknameSubmit}/>
            )}
            {step === "password" && (
                <SetPasswordForm nickname={nickname} email={email}/>
            )}
        </div>
    );
}