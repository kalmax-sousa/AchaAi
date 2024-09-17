import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formCreateItemSchema = z.object({
    name: z.string().min(1, "Digite um nome"),
    description: z.string().min(1, "Forneça uma descrição"),
    location: z.string().min(1, "Forneça uma descrição"),
    status: z.string().min(1, "Forneça uma descrição"),
    expired: z.string().min(1, "Forneça uma descrição"),
    category: z.string().min(1, "Forneça uma descrição"),
    finded_at: z.string().min(1, "Forneça uma descrição"),
})

export const useCreateItem = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

    const createItem = useForm<z.infer<typeof formCreateItemSchema>>({
        resolver: zodResolver(formCreateItemSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            status: "",
            expired: "",
            category: "",
            finded_at: "",
        }
    })

    const onSubmit = async () => {

    }

    return {onSubmit, createItem, isLoading}
}