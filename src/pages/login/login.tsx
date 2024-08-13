interface ApiErrorResponse {
    response?: {
        status: number,
        data?: {
            errors?: {
                default?: string;
            };
        };
    };
    message?: string;
}

import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { loginValidationSchema } from "../../utils/loginValidation";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthProvider/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../components/ui/form";

export function Login() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    const form = useForm({
        resolver: yupResolver(loginValidationSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            senha: ''
        }
    });

    async function onSubmit(data: { email: string, senha: string }) {
        try {
            const response = await authenticate(data.email, data.senha);

            if (response.id) {
                navigate('/')
            }

        } catch (error: unknown) {
            const apiError = error as ApiErrorResponse;
            console.log(apiError);
            if (apiError.response?.status === 401) {
                toast.error('E-mail ou senha são inválidos')
            } else if (apiError.response?.status === 500) {
                toast.error('Erro interno no servidor')
            } else if (apiError.message) {
                toast.error(apiError.message);
            } else {
                toast.error('Ocorreu um erro desconhecido');
            }
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Entrar</CardTitle>
                    <CardDescription>
                        Insira seu e-mail abaixo para acessar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Senha</Label>
                                        <Link to="#" className="ml-auto inline-block text-sm underline">
                                            Esqueceu sua senha?
                                        </Link>
                                    </div>
                                    <FormField control={form.control} name="senha" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="senha"
                                                    type="password"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                                <Button type="submit" className="w-full">
                                    Entrar
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Entrar com o Google
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link to="/cadastre-se" className="underline">
                            Inscreva-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
