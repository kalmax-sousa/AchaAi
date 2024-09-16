import { SendRecoveryPassword } from "@/application/usecase/sendRecoveryPassword"
import { toast } from "@/hooks/use-toast"
import { AuthGateway } from "@/infrastructure/gateways/authGateway"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formRecoveryPasswordSchema = z.object({
    email: z.string().email("Digite um email válido"),
})

export const useRecoveryPassword = () => {
    const [isLoading, setIsLoading] = useState(false)

    const recoveryPassword = useForm<z.infer<typeof formRecoveryPasswordSchema>>({
        resolver: zodResolver(formRecoveryPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (data : z.infer<typeof formRecoveryPasswordSchema>) => {
        setIsLoading(true)

        const authRepository = new AuthGateway()
        const sendRecoveryPassword = new SendRecoveryPassword(authRepository)

        await sendRecoveryPassword.execute(data.email)
        .then(() => {
            console.log("Email enviado!")
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            toast({
                duration: 3000,
                variant: "success",
                title: "Email enviado!",
                description: "Verifique sua caixa de entrada",
            })
            setIsLoading(false)
        })
        
    }

    return {isLoading, onSubmit, recoveryPassword}
}