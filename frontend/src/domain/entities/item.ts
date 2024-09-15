type ItemStatus = "DELIVERED" | "LOST_AND_FOUND" | "WITH_FINDER";

export class Item {
    public name: string;
    public description?: string;
    public location: string;
    public imageUrl?: string;
    public status: ItemStatus;  
    public findedAt: Date;
    public expired: boolean;
    public userId: number;
    public categoryId: number;

    constructor(
        name: string,
        location: string,
        userId: number,
        categoryId: number,
        status: ItemStatus = "WITH_FINDER",
        findedAt: Date = new Date(),
        expired: boolean = false,
        description?: string,
        imageUrl?: string
    ) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.imageUrl = imageUrl;
        this.status = status;
        this.findedAt = findedAt;
        this.expired = expired;
        this.userId = userId;
        this.categoryId = categoryId;
    }

    // Método para alterar o status do item
    updateStatus(newStatus: ItemStatus): void {
        this.status = newStatus;
    }

    // Método para marcar o item como expirado
    markAsExpired(): void {
        this.expired = true;
    }

    // Método para verificar se o item foi encontrado recentemente (por exemplo, nas últimas 24 horas)
    isRecentlyFound(): boolean {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const timeDifference = new Date().getTime() - this.findedAt.getTime();
        return timeDifference <= oneDayInMs;
    }

    // Método para retornar uma descrição curta do item
    getShortDescription(): string {
        return this.description ? `${this.description.slice(0, 100)}...` : "Sem descrição";
    }

    // Método para verificar se o item está com o encontrador
    isWithFinder(): boolean {
        return this.status === "WITH_FINDER";
    }

    // Método para atualizar a localização do item
    updateLocation(newLocation: string): void {
        if (!newLocation) throw new Error("A nova localização não pode ser vazia.");
        this.location = newLocation;
    }
}
