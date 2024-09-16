import { RecoveryPassword } from "@/application/usecase/recoveryPassword"
import { CustomError } from "@/domain/entities/error"
import { toast } from "@/hooks/use-toast"
import { UserGateway } from "@/infrastructure/gateways/userGateway"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

const formRecoveryPassword = z.object({
    password: z.string().min(1, "Digite sua nova senha"),
    password_confirmation: z.string().min(1, "Confirme sua nova senha"),
})
.refine((data) => data.password === data.password_confirmation, {
    path: ["confirmPassword"], 
    message: "As senhas precisam ser iguais",
})

export const useRecoveryPassword = () => {
    const {token} = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    }

    const recoveryPassword = useForm<z.infer<typeof formRecoveryPassword>>({
        resolver: zodResolver(formRecoveryPassword),
        defaultValues: {
            password: "",
            password_confirmation: "",
        }
    })

    const onSubmit = async (data : z.infer<typeof formRecoveryPassword>) => {
        if(token){
            setIsLoading(true)
            const userRepository = new UserGateway()
            const recoveryPassword = new RecoveryPassword(userRepository)
    
            try {
                await recoveryPassword.execute(
                    data.password,
                    token
                )
                
                toast({
                    variant: "success",
                    duration: 3000,
                    description: "Sua senha foi alterada com sucesso!",
                    title: "Sucesso",
                })
            } catch (error) {
                if (error instanceof CustomError) {
                    error.errors.forEach((err) => {
                        toast({
                            duration: 3000,
                            variant: "destructive",
                            title: "Erro",
                            description: err,
                        });
                    });
                } else if (error instanceof Error) {
                    toast({
                        duration: 3000,
                        variant: "destructive",
                        title: "Erro",
                        description: error.message,
                    });
                } else {
                    toast({
                        duration: 3000,
                        variant: "destructive",
                        title: "Erro",
                        description: "Ocorreu um erro inesperado",
                    });
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    return { 
        isLoading,
        showPassword,
        togglePasswordVisibility,
        showConfirmPassword,
        toggleConfirmPasswordVisibility,
        recoveryPassword, 
        onSubmit
    }
}