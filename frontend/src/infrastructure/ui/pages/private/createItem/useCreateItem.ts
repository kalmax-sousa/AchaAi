import { z } from "zod"

const formCreateItemSchema = z.object({
    name: z.string().min(1, "Digite um nome"),
    description: z.string().min(1, "Forneça uma descrição"),
    location: z.string().min(1, "Forneça uma descrição"),
    status: z.string().min(1, "Forneça uma descrição"),
    expired: z.string().min(1, "Forneça uma descrição"),
    category: z.string().min(1, "Forneça uma descrição"),
    finded_at: z.string().min(1, "Forneça uma descrição"),
    image: z.instanceof(File),
})

export const useCreateItem = () => {

    return {}
}