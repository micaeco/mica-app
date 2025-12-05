import { eq } from "drizzle-orm";

import { User } from "@domain/entities/user";
import { UserRepository } from "@domain/repositories/user";
import { DbType } from "@infrastructure/db";
import { user as userTable } from "@infrastructure/db/schema/auth/user";

export class PostgresUserRepository implements UserRepository {
  constructor(private db: DbType) {}

  async findById(id: string): Promise<User | null> {
    const users = await this.db.select().from(userTable).where(eq(userTable.id, id));
    return users.length > 0 ? (users[0] as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return users.length > 0 ? (users[0] as User) : null;
  }
}
