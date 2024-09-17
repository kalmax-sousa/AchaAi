import { NavBar } from "@/infrastructure/ui/components/Navbar"
import { useHome } from "./useHome"
import { User } from "@/domain/entities/user"
import { Publication } from "@/infrastructure/ui/components/Publication"
import { Item } from "@/domain/entities/item"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/infrastructure/ui/components/button"
import { Category } from "@/domain/entities/category"

const Home = () => {
    const { isLoading, handleLogout, user, publications, categories } = useHome()
    return (
        <div className="h-screen">
            <NavBar 
                user={user as User}
                logout={handleLogout}
            />

            { !isLoading && (
                <div className="mx-auto px-4 py-8 overflow-y-auto max-h-[calc(100vh-70px)] h-full dark:bg-neutral-700">
                    <div className="md:max-w-sm max-w-[80%] mx-auto space-y-4">
                        {publications.map((publication) => (
                            <Publication key={publication.id} publication={publication as Item} categories={categories as Category[]}/> 
                        ))}
                    </div>
                </div>
            )}

            <Link to="/item/create" className={`${buttonVariants({ variant: "default" })} bg-teal-800 text-white rounded-full absolute right-4 bottom-4`}>
                Nova publicação
            </Link>

        </div>
    )
}

export default Home