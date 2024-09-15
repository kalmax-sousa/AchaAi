import { User } from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/userRepository";

export class AuthenticateUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(email: string, password: string): Promise<User> {
        return await this.userRepository.authenticate(email, password);
    }
}