import type { ChangeEvent } from "react";

export type PasswordInputProps = {
    password: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isPasswordShown: boolean;
    onClick: () => void;
}