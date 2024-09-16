import { AxiosError } from "axios"
import { api } from "../http/api"
import { User } from "@/domain/entities/user"
import { CustomError } from "@/domain/entities/error";
import { AuthRepository } from "@/domain/repositories/authRepository";

export class AuthGateway implements AuthRepository {
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

    async confirmateAccount(token: string): Promise<void> {
        try {
            await api.post('session/confirmation', { token })
        } catch (error) {
            const axiosError = error as AxiosError;
            const errors: string[] = []
        
            if (axiosError.code === 'ERR_NETWORK') {
                errors.push('Erro de rede');
            }
        
            if(axiosError.response?.status === 401) {
                errors.push('Token inválido')
            } else if(axiosError.response?.status === 200) {
                errors.push('Email já verificado')
            } else if(axiosError.response?.status === 400) {
                errors.push('Falha na validação dos dados')
            } else {
                errors.push('Erro desconhecido no servidor')
            }
            
            if (errors.length > 0) {
              throw new CustomError(errors);
            }
        
            throw axiosError;
        }
    }

    async sendRecoveryPassword(email: string): Promise<void> {
        try {
            await api.post('session/recovery', { email })
        } catch (error) {
            throw error   
        }
    }
}