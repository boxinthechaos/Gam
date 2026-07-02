import { VerifyContext } from "../../context/VerifyContext";
import type { VerifyType } from "../../types/VerifyType";

import VerifyingForm from "../../components/auth/form/VerifyingForm"

export default function VerifyEmail() {
    const savedType = sessionStorage.getItem("verifyType");

    const type: VerifyType =
        savedType === "find-nickname" ||
        savedType === "reset-password" ||
        savedType === "sign-up"
            ? savedType
            : "sign-up";

    return (
        <VerifyContext.Provider value={type}>
            <div className="page">
                <VerifyingForm/>
            </div>
        </VerifyContext.Provider> 
    )
}