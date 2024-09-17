import { Card, CardContent, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { useRecoveryPassword } from "./useRecoveryPassword"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/infrastructure/ui/components/form"
import { Input } from "@/infrastructure/ui/components/input"
import { ButtonTooglePasswordVisibility } from "@/infrastructure/ui/components/ButtonTooglePasswordVisibility"
import { Button } from "@/infrastructure/ui/components/button"

const RecoveryPassword = () => {
    const {
        isLoading,
        showPassword,
        togglePasswordVisibility,
        showConfirmPassword,
        toggleConfirmPasswordVisibility,
        recoveryPassword,
        onSubmit
    } = useRecoveryPassword()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle>Recuperar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...recoveryPassword}>
                        <form onSubmit={recoveryPassword.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="password" 
                                control={recoveryPassword.control}
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
                                name="password_confirmation" 
                                control={recoveryPassword.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    placeholder="Confirmar Senha"
                                                    className="pr-10"
                                                    {...field}
                                                />

                                                <ButtonTooglePasswordVisibility 
                                                    showPassword={showConfirmPassword} 
                                                    togglePasswordVisibility={toggleConfirmPasswordVisibility} 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        
                            <Button className="w-full bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                Alterar Senha
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecoveryPassword