import { UserRepository } from "@/domain/repositories/userRepository"

export class ConfirmateAccount {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(token: string): Promise<void> {
        await this.userRepository.confirmateAccount(token)
    }
}