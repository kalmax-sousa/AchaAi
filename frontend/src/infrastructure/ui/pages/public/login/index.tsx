import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { useLogin } from "./useLogin"

const Login = () => {
    const { login, isLoading, onSubmit } = useLogin()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-lg">ACHA.AI</CardTitle>
                    <CardDescription className="text-center">Faça login para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...login}>
                        <form onSubmit={login.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="email" 
                                control={login.control}
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

                            <FormField
                                name="password" 
                                control={login.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                autoComplete="current-password"
                                                placeholder="Senha"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >

                            </FormField>

                            <div className="w-full text-right">
                                <Link to="/" className={buttonVariants({ variant: "link" })}>Esqueceu a senha?</Link>
                            </div>
                        
                            <Button className="w-full bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                Entrar
                            </Button>

                            <div className="w-full text-center">
                                <Link to="/auth/register" className={buttonVariants({ variant: "link" })}>Criar conta</Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login