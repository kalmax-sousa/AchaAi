import { Button, buttonVariants } from "@/infrastructure/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { FormControl, FormField, FormItem, FormMessage } from "@/infrastructure/ui/components/form"
import { Input } from "@/infrastructure/ui/components/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { Form } from "react-router-dom"
import { useCreateItem } from "./useCreateItem"

const CreateItem = () => {
    const {createItem, onSubmit, isLoading} = useCreateItem()

    return(
        <Card className="w-[90%] max-w-md shadow-lg rounded-lg dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle className="text-center text-lg">ACHA.AI</CardTitle>
                    <CardDescription className="text-center">Faça login para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...createItem}>
                        <form onSubmit={createItem.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="name" 
                                control={createItem.control}
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
                                name="description" 
                                control={createItem.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Descrição"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="location" 
                                control={createItem.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Localização"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                name="location" 
                                control={createItem.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Localização"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                name="status" 
                                control={createItem.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Localização"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        
                            <div>
                            <Link to="/" className={buttonVariants({ variant: "default" })}>Voltar</Link>

                            <Button className="w-full bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                            </Button>
                            </div>

                            <div className="w-full text-center">
                                <Link to="/auth/register" className={buttonVariants({ variant: "link" })}>Criar conta</Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
    )
}

export default CreateItem