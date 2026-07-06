export interface RequestingCodeProps {
    onCodeSent: () => void;
    email: string;
    setEmail: (value: string) => void;
}