import { User } from "@core/entities/user";

export interface UserRepository {
  create(user: Omit<User, "id">): Promise<User>;

  findById(userId: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  update(userId: string, user: Partial<User>): Promise<User | null>;

  delete(userId: string): Promise<User | null>;
}
