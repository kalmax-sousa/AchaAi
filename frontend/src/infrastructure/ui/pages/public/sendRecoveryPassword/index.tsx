import { Button, buttonVariants } from "@/infrastructure/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/infrastructure/ui/components/form"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { Input } from "@/infrastructure/ui/components/input"
import { useSendRecoveryPassword } from "./useRecoveryPassword"

const SendRecoveryPassword = () => {
    const { sendRecoveryPassword, isLoading, onSubmit } = useSendRecoveryPassword()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-lg">ACHA.AI</CardTitle>
                    <CardDescription className="text-center">Insira seu email para redefinir sua senha</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...sendRecoveryPassword}>
                        <form onSubmit={sendRecoveryPassword.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="email" 
                                control={sendRecoveryPassword.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                autoComplete="email"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        
                            <Button className="w-full bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar
                            </Button>

                            <div className="w-full text-center">
                                <Link to="/auth/login" className={buttonVariants({ variant: "link" })}>Retornar para o login</Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SendRecoveryPassword