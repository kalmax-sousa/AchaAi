import { Avatar, AvatarFallback, AvatarImage } from "@/infrastructure/ui/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/infrastructure/ui/components/dropdown-menu";
import { Button } from "@/infrastructure/ui/components/button";
import { User } from "@/domain/entities/user";

type Props = {
    user: User
    logout: () => void
}

export function NavBar({user, logout}: Props) {
  return (
    <nav className="flex justify-between items-center p-4 border-b-2 ">
      <div className="text-white font-bold text-md">ACHA.AI</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0">
            <Avatar>
              <AvatarImage src={user.image_url || ""} alt="User" />
              <AvatarFallback>{user.name?.slice(0, 2) || "A"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent>
            <DropdownMenuLabel>
                {user.name || "Nome do Usuário"}
                
            </DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-400">
                {user.email || "email@example.com"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => alert("Perfil")}>
                Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
                Sair
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
