import { Card, CardContent } from "@/components/ui/card"
import { useConfirmateAccount } from "./useConfirmateAccount"
import { CheckCircledIcon, CrossCircledIcon, ReloadIcon } from "@radix-ui/react-icons"

const ConfirmateAccount = () => {

    const {isLoading, status, textError} = useConfirmateAccount()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                
                <CardContent className="flex flex-col items-center gap-6 p-8">
                    {isLoading 
                        ? <>
                            <ReloadIcon color="white" width={48} height={48} className="animate-spin" />
                            <p>Carregando...</p> 
                        </>
                        : status === 200
                            ? <>
                                <CheckCircledIcon color="green" width={48} height={48}/> 
                                <p>A sua conta foi confirmada com sucesso.</p>
                            </>
                            : <>
                                <CrossCircledIcon color="red" width={48} height={48}/>
                                {textError.map((err, index) => (
                                    <p key={index}>{err}</p>

                                ))}
                            </>
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default ConfirmateAccount