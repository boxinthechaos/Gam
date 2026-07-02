import { createContext } from "react";

import type { VerifyType } from "../types/VerifyType";

export const VerifyContext = createContext<VerifyType>("sign-up");