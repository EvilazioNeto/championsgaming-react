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

export const recuperarSenhaValidationSchema = yup.object().shape({
    email: yup.string().email('E-mail deve ser válido').required('E-mail é obrigatório').matches(/\S+@\S+\.\S+/, 'E-mail deve ser válido'),
})

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

function EsqueceuSenha() {
    const form = useForm({
        resolver: yupResolver(recuperarSenhaValidationSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        }
    });



    async function onSubmit(data: { email: string }) { 
        try {
            const res = await Api.post('/forgot-password', { email: data.email });

            if (res.status === 200) {
                console.log(res.data);

                toast.success("Email enviado para: " + data.email )
            }

        } catch (error) {
            const apiError = error as ApiErrorResponse;
            console.log(apiError.response);
            if (apiError.response?.status === 404) {
                toast.error(apiError.response.data?.errors?.default);
            } else {
                toast.error('Ocorreu um erro desconhecido');
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
                            Digite seu e-mail para receber um link de redefinição de senha
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>

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
                                <Button type="submit" className="w-full">
                                    Enviar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default EsqueceuSenha;
