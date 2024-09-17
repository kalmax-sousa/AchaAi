import { Item } from "@/domain/entities/item"
import { ItemRepository } from "@/domain/repositories/itemRepository"

export class ListItems {
    constructor(private readonly itemsRepository: ItemRepository) {}

    async execute(): Promise<Item[]> {
        return this.itemsRepository.getAll()
    }
}