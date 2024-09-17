import { SendRecoveryPassword } from "@/application/usecase/sendRecoveryPassword"
import { toast } from "@/infrastructure/ui/hooks/use-toast"
import { AuthGateway } from "@/infrastructure/gateways/authGateway"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSendRecoveryPasswordSchema = z.object({
    email: z.string().email("Digite um email válido"),
})

export const useSendRecoveryPassword = () => {
    const [isLoading, setIsLoading] = useState(false)

    const sendRecoveryPassword = useForm<z.infer<typeof formSendRecoveryPasswordSchema>>({
        resolver: zodResolver(formSendRecoveryPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (data : z.infer<typeof formSendRecoveryPasswordSchema>) => {
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

    return {isLoading, onSubmit, sendRecoveryPassword}
}