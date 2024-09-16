import { AuthRepository } from "@/domain/repositories/authRepository"

export class SendRecoveryPassword {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(email: string): Promise<void> {
        await this.authRepository.sendRecoveryPassword(email)
    }
}