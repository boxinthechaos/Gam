export const PASSWORD_RULES = [
  { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
  { label: "영문자 A~z", test: (pw: string) => /[a-zA-Z]/.test(pw) },
  { label: "숫자 0~9", test: (pw: string) => /[0-9]/.test(pw) },
  {
    label: "특수문자 ...",
    test: (pw: string) => /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(pw),
  },
];