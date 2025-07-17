CREATE TABLE "app"."household_invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"household_id" text NOT NULL,
	"invited_email" text NOT NULL,
	"token" text NOT NULL,
	"inviter_user_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	CONSTRAINT "household_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "app"."household_invitations" ADD CONSTRAINT "household_invitations_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "app"."households"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."household_invitations" ADD CONSTRAINT "household_invitations_inviter_user_id_user_id_fk" FOREIGN KEY ("inviter_user_id") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;