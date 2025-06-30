import { auth } from "@adapters/auth";
import { createContainer } from "@di/container";

export async function createContext() {
  const session = await auth.getSession();
  const container = createContainer();

  const userHouseholds = await container.householdUserRepo.findHouseholdsByUserId(
    session?.user.sub ?? ""
  );

  return {
    session,
    userHouseholds,
    ...container,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
