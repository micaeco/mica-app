import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { Context } from "@adapters/trpc/context";
import { AppError, ErrorKey as DomainErrorKey } from "@domain/entities/errors";

import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      message: error.message,
      data: {
        ...shape.data,
        code: error.code as ServerErrorCode,
      },
    };
  },
});

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export type ServerErrorCode = DomainErrorKey | TRPC_ERROR_CODE_KEY;

const errorFormatterMiddleware = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    if (error instanceof AppError) {
      throw new TRPCError({
        code: error.code,
        message: error.message,
        cause: error,
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred. Please try again later.",
      cause: error,
    });
  }
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(errorFormatterMiddleware);
export const protectedProcedure = t.procedure.use(enforceAuth).use(errorFormatterMiddleware);
