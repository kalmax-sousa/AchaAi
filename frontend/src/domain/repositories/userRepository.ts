import { User } from "@/domain/entities/user";

export interface UserRepository {
    authenticate(email: string, password: string): Promise<User>;
}
