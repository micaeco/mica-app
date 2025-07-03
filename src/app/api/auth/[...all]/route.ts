import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@adapters/auth";

export const { POST, GET } = toNextJsHandler(auth);
