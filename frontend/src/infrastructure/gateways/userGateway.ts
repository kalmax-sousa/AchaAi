import { AxiosError } from "axios"
import { api } from "../http/api"
import { UserRepository } from "@/domain/repositories/userRepository"
import { User } from "@/domain/entities/user"
import { CustomError } from "@/domain/entities/error";

interface ApiErrorResponse {
    message?: string;
    errors?: string[];
}

export class UserGateway implements UserRepository {
    async authenticate(email: string, password: string): Promise<User> {
        try {
            const response = await api.post('/session', { email, password })
            const user = new User(response.data.email, response.data.name, response.data.token, response.data.id)
            return user
        } catch (error) {
            const axiosError = error as AxiosError
            if(axiosError.code === "ERR_NETWORK") {
                throw new Error('Erro de rede')
            }
            if (axiosError.response?.status === 401) {
                throw new Error("Email ou senha inválidos")
            }
            throw axiosError
        }
    }  
    
    async create(email: string, enrollment: string, name: string, password: string, password_confirmation: string): Promise<void> {
        try {
            await api.post('/users/', { email, enrollment, name, password, password_confirmation })

        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const errors: string[] = [];
        
            if (axiosError.code === 'ERR_NETWORK') {
                errors.push('Erro de rede');
            }
        
            if (axiosError.response?.status === 400) {
                const responseData = axiosError.response.data as ApiErrorResponse;
            
                if (responseData.errors) {
                    errors.push(...responseData.errors);
                } else if (responseData.message) {
                    errors.push(responseData.message);
                } else {
                    errors.push('Erro desconhecido no servidor');
                }
            }
        
            if (errors.length > 0) {
              throw new CustomError(errors);
            }
        
            throw axiosError;
        }
    }
}