import { Category } from "@/domain/entities/category";
import { CategoryRepository } from "@/domain/repositories/categoryRepository";

export class ListCategories {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async execute(): Promise<Category[]> {
        return this.categoryRepository.list()
    }
}