import { CreateUser } from "@/application/usecase/createUser"
import { CustomError } from "@/domain/entities/error"
import { useToast } from "@/infrastructure/ui/hooks/use-toast"
import { UserGateway } from "@/infrastructure/gateways/userGateway"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formRegisterSchema = z.object({
    name: z.string().min(1, "Digite seu nome"),
    enrollment: z.string().min(1, "Digite sua matrícula"),
    email: z.string().email("Digite um email válido"),
    password: z.string().min(1, "Digite sua senha"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
})
.refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], 
    message: "As senhas precisam ser iguais",
})

export const useRegister = () => {
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const register = useForm<z.infer<typeof formRegisterSchema>>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            name: "",
            enrollment: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formRegisterSchema>) => {
        setIsLoading(true);
        const userRepository = new UserGateway();
        const createUser = new CreateUser(userRepository);
        
        try {
            await createUser.execute(data.email, data.enrollment, data.name, data.password, data.confirmPassword)
            toast({
                duration: 3000,
                variant: "success",
                title: "Conta criada com sucesso",
                description: "Verifique seu e-mail para ativar sua conta",
            })
        } catch (error) {
            if (error instanceof CustomError) {
                // Cria um toast para cada erro na lista de erros
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

    return {
        register,
        isLoading,
        showPassword,
        showConfirmPassword,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
        onSubmit
    }
}