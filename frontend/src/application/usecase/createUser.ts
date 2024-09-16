import { UserRepository } from "@/domain/repositories/userRepository"

export class CreateUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(email: string, enrollment: string, name: string, password: string, confirmation: string): Promise<void> {
        await this.userRepository.create(email, enrollment, name, password, confirmation)
    }
}