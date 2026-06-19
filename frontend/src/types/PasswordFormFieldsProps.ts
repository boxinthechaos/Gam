export type PasswordFormFieldsProps = {
  password: string;
  passwordAgain: string;
  onPasswordChange: (v: string) => void;
  onPasswordAgainChange: (v: string) => void;
}