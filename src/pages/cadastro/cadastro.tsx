// import { Link } from 'react-router-dom';
// import styles from './cadastro.module.css';
// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup';
// import { cadastroValidationSchema } from '../../utils/cadastroValidation';
// import { Api } from '../../services/api/axios-config';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// interface ICadastroProps {
//     nome: string;
//     email: string;
//     senha: string;
// }

// interface ApiErrorResponse {
//     response?: {
//         data?: {
//             errors?: {
//                 default?: string;
//             };
//         };
//     };
//     message?: string; 
// }

// function Cadastro() {
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(cadastroValidationSchema)
//     });

//     const onSubmit = async (data: ICadastroProps) => {
//         try {
//             const response = await Api.post('/cadastrar', data)

//             if (response.status === 201) {
//                 toast.success('Usuário cadastrado com sucesso!');
//                 navigate("/login");
//             } else if (response.status === 500) {
//                 toast.warning('Erro interno no servidor');
//             }
//         } catch (error: unknown) {
//             console.log(error)
//             const apiError = error as ApiErrorResponse;
//             if (apiError.response && apiError.response.data && apiError.response.data.errors && apiError.response.data.errors.default) {
//                 toast.error(apiError.response.data.errors.default);
//             } else if (apiError.message) {
//                 toast.error(apiError.message);
//             } else {
//                 toast.error('Ocorreu um erro desconhecido');
//             }
//         }
//     }

//     return (
//         <main className={styles.containerCadastro}>
//             <form className={styles.formCadastro} onSubmit={handleSubmit(onSubmit)}>
//                 <h2>CADASTRE-SE</h2>
//                 <div>
//                     <p>Nome:</p>
//                     <input
//                         type="text"
//                         {...register('nome')}
//                     />
//                     <div className={styles.msgError}>{errors.nome?.message}</div>
//                 </div>
//                 <div>
//                     <p>Email:</p>
//                     <input
//                         type="email"
//                         {...register('email')}
//                     />
//                     <div className={styles.msgError}>{errors.email?.message}</div>
//                 </div>
//                 <div>
//                     <p>Senha:</p>
//                     <input
//                         type="password"
//                         {...register('senha')}
//                     />
//                     <div className={styles.msgError}>{errors.senha?.message}</div>
//                 </div>
//                 <button className={styles.cadastroBtn}>CADASTRE-SE</button>
//                 <div className={styles.links}>
//                     <Link to="/login">
//                         Já tem uma conta?
//                     </Link>
//                 </div>
//             </form>
//         </main>
//     )
// }

// export default Cadastro;



import { useForm } from "react-hook-form"
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
import { Link, useNavigate } from "react-router-dom"
import { cadastroValidationSchema } from "../../utils/cadastroValidation"
import { Api } from "../../services/api/axios-config"
import { toast } from "react-toastify"
import { yupResolver } from "@hookform/resolvers/yup"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../components/ui/form"

interface ICadastroProps {
    nome: string;
    email: string;
    senha: string;
}

interface ApiErrorResponse {
    response?: {
        data?: {
            errors?: {
                default?: string;
            };
        };
    };
    message?: string;
}

export function Cadastro() {
    const navigate = useNavigate();
    const form = useForm({
        resolver: yupResolver(cadastroValidationSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            senha: '',
            nome: ''
        }
    });

    const onSubmit = async (data: ICadastroProps) => {
        try {
            const response = await Api.post('/cadastrar', data)

            if (response.status === 201) {
                toast.success('Usuário cadastrado com sucesso!');
                navigate("/login");
            } else if (response.status === 500) {
                toast.warning('Erro interno no servidor');
            }
        } catch (error: unknown) {
            console.log(error)
            const apiError = error as ApiErrorResponse;
            if (apiError.response && apiError.response.data && apiError.response.data.errors && apiError.response.data.errors.default) {
                toast.error(apiError.response.data.errors.default);
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
                    <CardTitle className="text-xl">Cadastrar-se</CardTitle>
                    <CardDescription>
                        Insira suas informações para criar uma conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first-name">Nome</Label>
                                        <FormField control={form.control} name="nome" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="nome"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                    </div>

                                </div>
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
                                    <Label htmlFor="password">Senha</Label>
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
                                    Criar uma conta
                                </Button>

                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="underline">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

