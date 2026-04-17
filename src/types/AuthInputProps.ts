import type { ChangeEvent } from "react";

export type AuthInputProps = {
    nickName: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
