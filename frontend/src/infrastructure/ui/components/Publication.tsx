import { Badge } from "@/infrastructure/ui/components/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { Item } from "@/domain/entities/item"

type Props = {
    publication: Item
}

export const Publication = ({publication}: Props) => {
    return (
        <Card key={publication.id} className="w-full border-2 shadow-lg rounded-lg dark:bg-zinc-900">
            <CardContent className="p-6">
                <img src={publication.imageUrl} alt={publication.name} className="w-full h-full object-cover rounded-t-lg" />
            </CardContent>
            <CardHeader className="pt-0">
                <CardTitle>
                    {publication.name}
                </CardTitle>
                <CardDescription>{publication.description}</CardDescription>
            </CardHeader>
            <CardFooter className="gap-4">
                <Badge variant="primary">{publication.categoryId}</Badge>
                <Badge>{publication.status}</Badge>
            </CardFooter>
        </Card>
    )
}