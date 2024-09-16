import { User } from "@/domain/entities/user";

export interface UserRepository {
    authenticate(email: string, password: string): Promise<User>;
    create(email: string, enrollment: string, name: string, password: string, confirmation: string): Promise<void>;
}