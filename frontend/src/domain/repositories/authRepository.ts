import { User } from "@/domain/entities/user";

export interface AuthRepository {
    authenticate(email: string, password: string): Promise<User>
    confirmateAccount(token: string): Promise<void>
    sendRecoveryPassword(email: string): Promise<void>
}