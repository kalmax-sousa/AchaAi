import { AxiosError } from "axios"
import { api } from "../http/api"
import { UserRepository } from "@/domain/repositories/userRepository"
import { CustomError } from "@/domain/entities/error";

interface ApiErrorResponse {
    message?: string;
    errors?: string[];
}

export class UserGateway implements UserRepository { 
    
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

    async recoveryPassword(password: string, token: string): Promise<void> {
        try {
            await api.put('users/recovery', { password, token })
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const errors: string[] = [];
        
            if (axiosError.code === 'ERR_NETWORK') {
                errors.push('Erro de rede');
            }
        
            if (axiosError.response?.status) {
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