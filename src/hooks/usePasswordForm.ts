import { useState } from "react";
import { PASSWORD_RULES } from "../constants/password-rules";

export function usePasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const isPasswordValid =
    PASSWORD_RULES.every((rule) => rule.test(password)) &&
    password === passwordAgain &&
    passwordAgain.length > 0;

  return { password, setPassword, passwordAgain, setPasswordAgain, isPasswordValid };
}