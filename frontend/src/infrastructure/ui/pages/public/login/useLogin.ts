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

    const login = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formLoginSchema>) => {
        setIsLoading(true)
        await setTimeout(() => {
            console.log(data)
            setIsLoading(false)
        }, 3000)
    }

    return {
        login,
        isLoading,
        onSubmit
    }
}

