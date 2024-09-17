import { ListCategories } from "@/application/usecase/listCategories"
import { Category } from "@/domain/entities/category"
import { CategoryGateway } from "@/infrastructure/gateways/categoryGateway"
//import { ItemGateway } from "@/infrastructure/gateways/itemGateway"
import { toast } from "@/infrastructure/ui/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formCreateItemSchema = z.object({
    name: z.string().min(1, "Digite um nome"),
    description: z.string().min(1, "Forneça uma descrição"),
    location: z.string().min(1, "Forneça uma descrição"),
    status: z.string().min(1, "Forneça um status"),
    expired: z.boolean(),
    category: z.string().min(1, "Forneça uma categoria"),
    finded_at: z.string().min(1, "Forneça um usuário"),
    image: z.instanceof(File),
})


export const useCreateItem = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        const categoryRepository = new CategoryGateway()
        const categories = new ListCategories(categoryRepository)

        try{
            const response = await categories.execute()
            setCategories(response)
        } catch (err) {

        }
    }

    const createItem = useForm<z.infer<typeof formCreateItemSchema>>({
        resolver: zodResolver(formCreateItemSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            status: "",
            expired: false,
            category: "",
            finded_at: "",
            image: selectedImage,
        }
    })

    const onSubmit = async () => {
        setIsLoading(true);
        
        try {
            
            //toast.success("Login efetuado com sucesso!")
        } catch (error) {
            toast({
                duration: 3000,
                variant: "destructive",
                title: error + "",
                description: "Tente novamente",
            })
            setSelectedImage(undefined)
        } finally {
            setIsLoading(false)
        }
    }

    return {onSubmit, createItem, isLoading, categories}
}