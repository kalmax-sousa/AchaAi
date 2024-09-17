import { Category } from "../entities/category";

export interface CategoryRepository {
    list(): Promise<Category[]>
}