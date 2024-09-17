import { Item, ItemStatus } from "../entities/item";

export interface ItemRepository {
    getAll(): Promise<Item[]>
    create(name: string, description: string, location: string, image: File, status: ItemStatus, expired: string, category: string, finded_at: string): Promise<void>
}