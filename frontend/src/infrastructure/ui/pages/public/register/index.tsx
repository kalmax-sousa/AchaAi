import { Button, buttonVariants } from "@/infrastructure/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/infrastructure/ui/components/form"
import { Input } from "@/infrastructure/ui/components/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { useRegister } from "./useRegister"
import { ButtonTooglePasswordVisibility } from "@/infrastructure/ui/components/ButtonTooglePasswordVisibility"

const Register = () => {
    const { 
        register, 
        onSubmit, 
        isLoading, 
        showPassword, 
        showConfirmPassword, 
        togglePasswordVisibility, 
        toggleConfirmPasswordVisibility,
    } = useRegister()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-lg">ACHA.AI</CardTitle>
                    <CardDescription className="text-center">Crie sua conta para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...register}>
                        <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="name" 
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Nome"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="enrollment" 
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Matrícula"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                name="email" 
                                control={register.control}
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
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    placeholder="Senha"
                                                    className="pr-10"
                                                    {...field}
                                                />
                                                
                                                <ButtonTooglePasswordVisibility showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="confirmPassword" 
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    placeholder="Confirme a senha"
                                                    className="pr-10"
                                                    {...field}
                                                />
                                                
                                                <ButtonTooglePasswordVisibility showPassword={showConfirmPassword} togglePasswordVisibility={toggleConfirmPasswordVisibility} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        
                            <Button className="w-full bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                Criar conta
                            </Button>

                            <div className="w-full text-center">
                                <Link to="/auth/login" className={buttonVariants({ variant: "link" })}>
                                    Já tenho uma conta? <span className="text-teal-800 ml-2">Faça login</span>
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register