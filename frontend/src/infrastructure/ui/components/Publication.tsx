import { Badge } from "@/infrastructure/ui/components/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { Item } from "@/domain/entities/item"
import { Category } from "@/domain/entities/category"

type Props = {
    publication: Item
    categories: Category[]
}

export const Publication = ({publication, categories}: Props) => {
    return (
        <Card key={publication.id} className="w-full border-2 shadow-lg rounded-lg dark:bg-zinc-900">
            <CardContent className="p-6">
                <img src={publication.image_url} alt={publication.name} className="w-full h-full object-cover rounded-t-lg" />
            </CardContent>
            <CardHeader className="pt-0">
                <CardTitle>
                    {publication.name}
                </CardTitle>
                <CardDescription>{publication.description}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-4">
                <Badge variant="primary">{categories[publication.category_id].name}</Badge>
                <Badge>{publication.status === "DELIVERED" ? "Encontrado" : publication.status === "LOST_AND_FOUND" ? "Achados e Perdidos" : "Em posse"}</Badge>
            </CardFooter>
        </Card>
    )
}