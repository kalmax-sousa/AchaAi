import { AxiosError } from "axios"
import { api } from "../http/api"
import { CategoryRepository } from "@/domain/repositories/categoryRepository"
import { Category } from "@/domain/entities/category"

export class CategoryGateway implements CategoryRepository {
    async list(): Promise<Category[]> {
        try {
            const response = await api.get('/categories')
            return response.data
        } catch (error) {
            const axiosError = error as AxiosError
            if(axiosError.code === "ERR_NETWORK") {
                throw new Error('Erro de rede')
            }
            throw axiosError
        }
    }
}