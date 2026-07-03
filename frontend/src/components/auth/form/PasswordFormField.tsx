import type { PasswordFormFieldsProps } from "../../../types/PasswordFormFieldsProps";

import AuthInput from "../AuthInput";
import PasswordRuleList from "../PasswordRuleList";

export default function PasswordFormFields({ password, passwordAgain, onPasswordChange, onPasswordAgainChange }: PasswordFormFieldsProps) {
  return (
    <div>

        <AuthInput
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={(e) => onPasswordChange(e.target.value)}
          animation="animate-[appear_0.5s_ease-out_0.1s_forwards]"
        />

        <PasswordRuleList password={password} />

        <AuthInput
          type="password"
          value={passwordAgain}
          placeholder="비밀번호 재입력"
          onChange={(e) => onPasswordAgainChange(e.target.value)}
          animation="animate-[appear_0.5s_ease-out_0.3s_forwards]"
        />

        {passwordAgain.length > 0 && password !== passwordAgain && (
            <p className="mt-1 text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
        )}

    </div>
  );
}