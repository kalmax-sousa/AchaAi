import { AxiosError } from "axios"
import { api } from "../http/api"
import { UserRepository } from "@/domain/repositories/userRepository"
import { User } from "@/domain/entities/user"


export class UserGateway implements UserRepository {
    async authenticate(email: string, password: string): Promise<User> {
        try {
            const response = await api.post('/session', { email, password })
            const user = new User(response.data.email, response.data.name, response.data.token, response.data.id)
            return user
        } catch (error) {
            const axiosError = error as AxiosError
            throw axiosError
        }
    }   
}