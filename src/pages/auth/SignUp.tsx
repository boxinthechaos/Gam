import { useState } from "react";
import NicknameForm from "../../components/auth/form/SignUpForm/NicknameForm";
import PasswordSettingForm from "../../components/auth/form/SignUpForm/PasswordSettingForm";

export default function SignUp() {
    const [step, setStep] = useState<"nickname" | "password">("nickname");
    const [nickname, setNickname] = useState<string>("");

    const handleNicknameSubmit = (value: string) => {
        setNickname(value);
        setStep("password");
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen">
            {step === "nickname" && (
                <NicknameForm onNext={handleNicknameSubmit} />
            )}
            {step === "password" && (
                <PasswordSettingForm nickname={nickname} />
            )}
        </div>
    );
}