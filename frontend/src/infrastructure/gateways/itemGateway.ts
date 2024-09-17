import { AxiosError } from "axios"
import { api } from "../http/api"
import { ItemRepository } from "@/domain/repositories/itemRepository";
import { Item, ItemStatus } from "@/domain/entities/item";

export class ItemGateway implements ItemRepository {
    async getAll(): Promise<Item[]> {
        try {
            const response = await api.get('/items') 
            console.log(response.data)   
            return response.data
        } catch (error) {
            const axiosError = error as AxiosError
            if(axiosError.code === "ERR_NETWORK") {
                throw new Error('Erro de rede')
            }
            throw axiosError
        }
    }

    async create(name: string, description: string, location: string, image: File, status: ItemStatus, expired: string, category: string, finded_at: string): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('image', image);
            formData.append('status', status);
            formData.append('expired', expired);
            formData.append('category', category);
            formData.append('finded_at', finded_at);
            await api.post('/items', formData)
        } catch (error) {
            const axiosError = error as AxiosError
            if(axiosError.code === "ERR_NETWORK") {
                throw new Error('Erro de rede')
            }
            throw axiosError
        }
    }
}