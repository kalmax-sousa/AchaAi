import { ListCategories } from "@/application/usecase/listCategories"
import { ListItems } from "@/application/usecase/listItems"
import { Category } from "@/domain/entities/category"
import { Item } from "@/domain/entities/item"
import { CategoryGateway } from "@/infrastructure/gateways/categoryGateway"
import { ItemGateway } from "@/infrastructure/gateways/itemGateway"
import { useAuth } from "@/infrastructure/ui/context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const useHome = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [publications, setPublications] = useState<Item[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const navigate = useNavigate()

    const { logout, user } = useAuth()

    useEffect(() => {
        getPublications()
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

    const getPublications = async () => {
        setIsLoading(true)
        const itemRepository = new ItemGateway()
        const getPublications = new ListItems(itemRepository)

        try{
            const response = await getPublications.execute()
            console.log(response)
            setPublications(response)
        } catch (err) {

        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const onClickNewPost = () => {
        navigate('/item/create')
    }

    return {isLoading, handleLogout, user, publications, onClickNewPost, categories}
}