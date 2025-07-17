import { eq } from "drizzle-orm";

import { User, UserSchema } from "@domain/entities/user";
import { UserRepository } from "@domain/repositories/user";
import { DbType } from "@infrastructure/db";
import { user as userTable } from "@infrastructure/db/schema/auth/user";

export class PostgresUserRepository implements UserRepository {
  constructor(private db: DbType) {}

  async findById(id: string): Promise<User | null> {
    const users = await this.db.select().from(userTable).where(eq(userTable.id, id));
    return users.length > 0 ? UserSchema.parse(users[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return users.length > 0 ? UserSchema.parse(users[0]) : null;
  }
}
