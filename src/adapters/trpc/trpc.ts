import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { Context } from "@adapters/trpc/context";
import { AppError } from "@domain/entities/errors";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isAppError = error.cause instanceof AppError;

    // Log errors for monitoring and debugging
    if (process.env.NODE_ENV === "production") {
      // In production, log all errors with sanitized information
      console.error("[tRPC Error]", {
        code: isAppError ? error.cause.code : shape.data.code,
        message: error.message,
        ...(isAppError && error.cause.metadata ? { metadata: error.cause.metadata } : {}),
      });
    } else {
      // In development, log full error details including stack trace
      console.error("[tRPC Error]", {
        code: isAppError ? error.cause.code : shape.data.code,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
    }

    return {
      ...shape,
      message: error.message,
      data: {
        ...shape.data,
        code: isAppError ? error.cause.trpcCode : shape.data.code,
        httpStatus: isAppError ? error.cause.httpStatusCode : shape.data.httpStatus,
        customCode: isAppError ? error.cause.code : shape.data.code,
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

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceAuth);
