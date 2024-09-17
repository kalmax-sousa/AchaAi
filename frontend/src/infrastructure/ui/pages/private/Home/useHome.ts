import { ListItems } from "@/application/usecase/listItems"
import { Item } from "@/domain/entities/item"
import { ItemGateway } from "@/infrastructure/gateways/itemGateway"
import { useAuth } from "@/infrastructure/ui/context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const useHome = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [publications, setPublications] = useState<Item[]>([])
    const navigate = useNavigate()

    const { logout, user } = useAuth()

    useEffect(() => {
        getPublications()
    }, [])

    const getPublications = async () => {
        setIsLoading(true)
        const itemRepository = new ItemGateway()
        const getPublications = new ListItems(itemRepository)

        try{
            const response = await getPublications.execute()
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

    return {isLoading, handleLogout, user, publications, onClickNewPost}
}