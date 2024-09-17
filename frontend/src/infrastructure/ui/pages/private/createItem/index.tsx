import { Button, buttonVariants } from "@/infrastructure/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/infrastructure/ui/components/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/infrastructure/ui/components/form"
import { Input } from "@/infrastructure/ui/components/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { useCreateItem } from "./useCreateItem"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller } from "react-hook-form"
import { Label } from "@/infrastructure/ui/components/label"

const CreateItem = () => {
    const {createItem, onSubmit, isLoading, categories} = useCreateItem()

    return(
        <div className="w-full h-[calc(100vh)] p-8">
            <Card className="w-[90%] max-w-md shadow-lg rounded-lg mx-auto h-full">
                <CardHeader>
                    <CardTitle className="text-lg">Cadastro de Item Perdido</CardTitle>
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

                            <Controller
                                name="status"
                                control={createItem.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full text-zinc-400">
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                
                                                <SelectItem value="DELIVERED">Devolvido</SelectItem>
                                                <SelectItem value="LOST_AND_FOUND">Achados e Perdidos</SelectItem>
                                                <SelectItem value="WITH_FINDER">Em posse</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            <Controller
                                name="category"
                                control={createItem.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full text-zinc-400">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Categoria</SelectLabel>
                                                {
                                                    categories.map((category) => (
                                                        <SelectItem value={category.id}>{category.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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

                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Picture</Label>
                                <Input id="picture" type="file" />
                            </div>
                        
                            <div className="flex justify-between">
                                <Link to="/" className={buttonVariants({ variant: "default" })}>Voltar</Link>

                                <Button className=" bg-teal-800 hover:bg-teal-900 transition-colors duration-300 text-white" type="submit" disabled={isLoading}>
                                    {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                                    Cadastrar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateItem