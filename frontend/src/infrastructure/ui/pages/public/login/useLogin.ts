import { AuthenticateUser } from "@/application/usecase/autenticateUser"
import { useToast } from "@/hooks/use-toast"
import { UserGateway } from "@/infrastructure/gateways/userGateway"
import { useAuth } from "@/infrastructure/ui/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formLoginSchema = z.object({
    email: z.string().email("Digite um email válido"),
    password: z.string().min(1, "Digite sua senha"),
})

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { login: loginContext } = useAuth()

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const login = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formLoginSchema>) => {
        setIsLoading(true);
        const userRepository = new UserGateway();
        const authenticateUser = new AuthenticateUser(userRepository);
        
        try {
            const user = await authenticateUser.execute(data.email, data.password)
            loginContext(user)
            //toast.success("Login efetuado com sucesso!")
        } catch (error) {
            toast({
                duration: 3000,
                variant: "destructive",
                title: error + "",
                description: "Tente novamente",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return {
        login,
        isLoading,
        showPassword,
        togglePasswordVisibility,
        onSubmit
    }
}

