import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import * as yup from 'yup'
import { ModeToggle } from "../../components/mode-toggle";
import { Api } from "../../services/api/axios-config";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const redefinirSenhaValidationSchema = yup.object().shape({
    password: yup.string()
        .required('A senha é obrigatória')
        .min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: yup.string()
        .required('A confirmação da senha é obrigatória')
        .oneOf([yup.ref('password')], 'As senhas devem corresponder'),
});

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

function RedefinirSenha() {
    const { token } = useParams();
    const navigate = useNavigate();

    const form = useForm({
        resolver: yupResolver(redefinirSenhaValidationSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    async function onSubmit(data: { password: string }) {
        try {
            const res = Api.post('/reset-password', { token: token, newPassword: data.password })

            if ((await res).status === 200) {
                toast.success("Senha alterada com sucesso!")
                navigate("/login")
            }

        } catch (error) {
            const apiError = error as ApiErrorResponse;
            console.log(apiError.response);
            if (apiError.response?.status === 400) {
                toast.error("Tempo para alteração de senha expirado");
            }
        }
    }

    return (
        <>
            <div className="absolute right-2 top-2">
                <ModeToggle />
            </div>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
                        <CardDescription>
                            Por favor, insira e confirme sua nova senha abaixo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Digite sua senha:"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )} />


                                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirme sua senha:"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )} />


                                <Button type="submit" className="w-full">
                                    Trocar Senha
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default RedefinirSenha;
