import { render } from "@react-email/components";
import { addDays } from "date-fns";
import { getMessages } from "next-intl/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@adapters/trpc/trpc";
import HouseholdInvitationEmail from "@app/_components/emails/household-invitation";
import { defaultLocale } from "@app/_i18n/routing";
import {
  AdminHouseholdUserCannotLeaveError,
  HouseholdInvitationAlreadyExistsError,
  HouseholdInvitationInvalidError,
  HouseholdSensorAlreadyExistsError,
  HouseholdUserAlreadyExistsError,
  NotFoundError,
  SensorNotFoundError,
  UnauthorizedError,
} from "@domain/entities/errors";
import { createHousehold, Household } from "@domain/entities/household";
import {
  createHouseholdInvitationInput,
  HouseholdInvitation,
} from "@domain/entities/household-invitation";
import { HouseholdUser } from "@domain/entities/household-user";
import { User } from "@domain/entities/user";
import { HouseholdInvitationRepository } from "@domain/repositories/household-invitation";
import { HouseholdUserRepository } from "@domain/repositories/household-user";
import { UserRepository } from "@domain/repositories/user";
import { Repositories } from "@domain/services/unit-of-work";
import { env } from "@env";

export const householdRouter = createTRPCRouter({
  create: protectedProcedure.input(createHousehold).mutation(async ({ input, ctx }) => {
    if (!(await ctx.sensorRepo.exists(input.sensorId))) {
      throw new SensorNotFoundError();
    }

    if (await ctx.householdRepo.findBySensorId(input.sensorId)) {
      throw new HouseholdSensorAlreadyExistsError();
    }

    const household = await ctx.unitOfWork.execute(async (repos: Repositories) => {
      const household = await repos.householdRepo.create(input);

      const householdUser: HouseholdUser = {
        householdId: household.id,
        userId: ctx.user.id,
        role: "admin",
      };

      await repos.householdUserRepo.create(householdUser);

      await ctx.sensorRepo.assignHouseholdToSensor(input.sensorId, household.id);

      return household;
    });

    return household;
  }),

  createInvitation: protectedProcedure
    .input(createHouseholdInvitationInput)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new UnauthorizedError();
      }

      const invitedUser = await ctx.userRepo.findByEmail(input.invitedEmail);
      if (invitedUser && (await ctx.householdUserRepo.exists(input.householdId, invitedUser.id))) {
        throw new HouseholdUserAlreadyExistsError();
      }

      const household = await ctx.householdRepo.findById(input.householdId);
      if (!household) {
        throw new NotFoundError("Household");
      }

      const existingInvitations = await ctx.householdInvitationRepo.exists(
        input.invitedEmail,
        input.householdId
      );
      if (existingInvitations) {
        for (const existingInvitation of existingInvitations) {
          if (existingInvitation.expiresAt < new Date()) {
            await ctx.householdInvitationRepo.delete(existingInvitation.id);
          } else if (existingInvitation.status === "pending") {
            throw new HouseholdInvitationAlreadyExistsError();
          }
        }
      }

      const invitation = ctx.unitOfWork.execute(async () => {
        const householdInvitation: Omit<HouseholdInvitation, "id"> = {
          householdId: input.householdId,
          invitedEmail: input.invitedEmail,
          inviterUserId: ctx.user.id,
          status: "pending",
          token: crypto.randomUUID(),
          expiresAt: addDays(new Date(), 7),
          createdAt: new Date(),
          acceptedAt: null,
        };

        const messages = (await getMessages({
          locale: ctx.user.locale || defaultLocale,
        })) as unknown as IntlMessages;

        const joinUrl = `${env.NEXT_PUBLIC_URL}/join-household/${householdInvitation.token}`;

        await ctx.emailService.sendEmail({
          to: input.invitedEmail,
          subject: messages.emails.householdInvitation.title,
          text: await render(
            HouseholdInvitationEmail({
              messages,
              locale: ctx.user.locale || defaultLocale,
              joinUrl,
              inviterName: ctx.user.name,
              householdName: household.name,
            }),
            {
              plainText: true,
            }
          ),
          html: await render(
            HouseholdInvitationEmail({
              messages,
              locale: ctx.user.locale || defaultLocale,
              joinUrl,
              inviterName: ctx.user.name,
              householdName: household.name,
            }),
            {
              pretty: true,
            }
          ),
        });

        return await ctx.householdInvitationRepo.create(householdInvitation);
      });

      return invitation;
    }),

  isInvitationTokenValid: protectedProcedure
    .input(z.object({ token: z.string() }))
    .output(z.boolean())
    .query(async ({ input, ctx }) => {
      const invitation = await isInvitationTokenValid(input.token, ctx);
      return invitation !== null;
    }),

  acceptInvitation: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;

      const invitation = await isInvitationTokenValid(token, ctx);
      if (!invitation) {
        throw new HouseholdInvitationInvalidError();
      }

      const householdUser: HouseholdUser = {
        householdId: invitation.householdId,
        userId: ctx.user.id,
        role: "member",
      };

      await ctx.unitOfWork.execute(async (repos: Repositories) => {
        await repos.householdUserRepo.create(householdUser);
        await repos.householdInvitationRepo.update(invitation.id, {
          status: "accepted",
          acceptedAt: new Date(),
        });
      });

      return { householdId: invitation.householdId };
    }),

  declineInvitation: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;

      const invitation = await isInvitationTokenValid(token, ctx);
      if (!invitation) {
        throw new HouseholdInvitationInvalidError();
      }

      await ctx.householdInvitationRepo.update(invitation.id, { status: "declined" });

      return { householdId: invitation.householdId };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(Household)
    .query(async ({ input, ctx }) => {
      const { id } = input;

      if (!ctx.userHouseholds.includes(id)) {
        throw new UnauthorizedError();
      }

      const household = await ctx.householdRepo.findById(id);

      if (!household) {
        throw new NotFoundError("Household");
      }

      return household;
    }),

  getAll: protectedProcedure.output(z.array(Household)).query(async ({ ctx }) => {
    const householdIds = await ctx.householdUserRepo.findHouseholdsByUserId(ctx.user.id);

    const households: Household[] = [];
    for (const householdId of householdIds) {
      const household = await ctx.householdRepo.findById(householdId);
      if (household) households.push(household);
    }

    return households;
  }),

  getUsers: protectedProcedure
    .input(z.object({ householdId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const householdUsers = await ctx.householdUserRepo.findByHouseholdId(householdId);

      if (!householdUsers) {
      }

      const users: User[] = [];
      for (const user of householdUsers) {
        const foundUser = await ctx.userRepo.findById(user.userId);
        if (foundUser) {
          users.push(foundUser);
        }
      }

      return users;
    }),

  update: protectedProcedure.input(Household).mutation(async ({ input, ctx }) => {
    const { id, ...data } = input;

    if (!ctx.userHouseholds.includes(id)) {
      throw new UnauthorizedError();
    }

    if (data.sensorId) {
      if (!(await ctx.sensorRepo.exists(data.sensorId))) {
        throw new SensorNotFoundError();
      }

      const existingHousehold = await ctx.householdRepo.findBySensorId(data.sensorId);
      if (existingHousehold && existingHousehold.id !== id) {
        throw new HouseholdSensorAlreadyExistsError();
      }
    }

    const household = await ctx.householdRepo.update(id, data);
    return household;
  }),

  leave: protectedProcedure
    .input(z.object({ householdId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { householdId } = input;

      if (!ctx.userHouseholds.includes(householdId)) {
        throw new UnauthorizedError();
      }

      const householdUser = await ctx.householdUserRepo.findById(householdId, ctx.user.id);

      if (!householdUser) {
        throw new NotFoundError("Household user");
      }

      if (householdUser.role === "admin") {
        throw new AdminHouseholdUserCannotLeaveError();
      }

      await ctx.householdUserRepo.delete(householdId, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ sensorId: z.string(), householdId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userHouseholds.includes(input.householdId)) {
        throw new UnauthorizedError();
      }

      await ctx.unitOfWork.execute(async (repos: Repositories) => {
        await ctx.sensorRepo.unassignHouseholdFromSensor(input.sensorId, input.householdId);
        await repos.householdRepo.delete(input.householdId);
      });

      return { id: input.householdId };
    }),
});

interface InvitationValidContext {
  user: User;
  householdInvitationRepo: HouseholdInvitationRepository;
  householdUserRepo: HouseholdUserRepository;
  userRepo: UserRepository;
}

async function isInvitationTokenValid(
  token: string,
  ctx: InvitationValidContext
): Promise<HouseholdInvitation | null> {
  const invitation = await ctx.householdInvitationRepo.findByToken(token);

  if (!invitation) {
    return null;
  }

  if (ctx.user.email && invitation.invitedEmail.toLowerCase() !== ctx.user.email) {
    return null;
  }

  if (invitation.expiresAt < new Date()) {
    await ctx.householdInvitationRepo.update(invitation.id, { status: "expired" });
    return null;
  }

  if (invitation.status !== "pending") {
    return null;
  }

  if (ctx.user.email && invitation.invitedEmail !== ctx.user.email) {
    return null;
  }

  return invitation;
}
