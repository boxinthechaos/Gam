export interface RequestingCodeProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    onCodeSent: () => void;
}