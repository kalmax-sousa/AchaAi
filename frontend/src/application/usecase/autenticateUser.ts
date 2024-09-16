import { User } from "@/domain/entities/user"
import { AuthRepository } from "@/domain/repositories/authRepository"

export class AuthenticateUser {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(email: string, password: string): Promise<User> {
        return await this.authRepository.authenticate(email, password)
    }
}