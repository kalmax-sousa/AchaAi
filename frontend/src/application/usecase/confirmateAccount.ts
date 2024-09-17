import { AuthRepository } from "@/domain/repositories/authRepository"

export class ConfirmateAccount {
    constructor(private readonly userRepository: AuthRepository) {}

    async execute(token: string): Promise<void> {
        await this.userRepository.confirmateAccount(token)
    }
}