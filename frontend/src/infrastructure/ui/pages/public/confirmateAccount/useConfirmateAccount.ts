import { ConfirmateAccount } from "@/application/usecase/confirmateAccouunt"
import { CustomError } from "@/domain/entities/error"
import { UserGateway } from "@/infrastructure/gateways/userGateway"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const useConfirmateAccount = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<number>(0)
    const [textError, setTextError] = useState<string[]>([])

    useEffect(() => {
        handleConfirmateAccount()
    }, [token])

    const handleConfirmateAccount = async () => {
        if (token) {
            setIsLoading(true)
            const userRepository = new UserGateway();
            const confirmateAccount = new ConfirmateAccount(userRepository);

            try{
                await confirmateAccount.execute(token)

                setStatus(200)

                setTimeout(() => {
                    navigate("/auth/login")
                }, 4000)
            } catch (error) {
                setStatus(0)
                const errors: string[] = [];
                if (error instanceof CustomError) {
                    error.errors.forEach((err) => {
                        errors.push(err)
                    });
                } else if (error instanceof Error) {
                    errors.push(error.message)
                } else {
                    errors.push("Ocorreu um erro inesperado")
                }

                setTextError(errors)
            } finally {
                setIsLoading(false)
            }
        } else {
            navigate("/auth/login")
        }
    }

    return {isLoading, status, textError}
}