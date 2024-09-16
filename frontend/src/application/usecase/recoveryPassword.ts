import { UserRepository } from "@/domain/repositories/userRepository"

export class RecoveryPassword {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(password: string, token: string): Promise<void> {
        await this.userRepository.recoveryPassword(password, token)
    }
}