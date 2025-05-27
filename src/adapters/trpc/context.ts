import { auth } from "@adapters/auth";
import { createContainer } from "@di/container";

export async function createContext() {
  const session = await auth.getSession();
  const container = createContainer();

  return {
    session,
    ...container,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
