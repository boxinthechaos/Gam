import type { ChangeEvent } from "react";

export type AuthInputProps = {
    value: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    animation: string;
}
