import { auth } from "@adapters/auth";

export type User = typeof auth.$Infer.Session.user;
