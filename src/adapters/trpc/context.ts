import { auth } from "@adapters/auth";
import { createContainer } from "@di/container";

export async function createContext(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const container = createContainer();

  const userHouseholds = session?.user?.id
    ? await container.householdUserRepo.findHouseholdsByUserId(session.user.id)
    : [];

  return {
    session,
    userHouseholds,
    ...container,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
