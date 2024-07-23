import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { useAuth } from '../../contexts/AuthProvider/useAuth';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '../../utils/loginValidation';

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

function Login() {
    const { authenticate } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginValidationSchema)
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
        <main className={styles.containerLogin}>
            <form className={styles.formLogin} onSubmit={handleSubmit(onSubmit)}>
                <h2>LOGIN</h2>
                <div>
                    <p>Email:</p>
                    <input
                        type="email"
                        {...register('email')}
                    />
                    <div className={styles.msgError}>{errors.email?.message}</div>
                </div>
                <div>
                    <p>Senha:</p>
                    <input
                        type="password"
                        {...register('senha')}
                    />
                    <div className={styles.msgError}>{errors.senha?.message}</div>
                </div>
                <button className={styles.loginBtn}>LOGIN</button>
                <div className={styles.links}>
                    <Link to="/cadastre-se">
                        Não tem uma conta?
                    </Link>
                    <Link to="/forgotpassword">
                        Esqueceu a senha?
                    </Link>
                </div>
            </form>
        </main>
    )
}

export default Login;


// import logo from '/logo-sem-fundo.png';
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import { Link } from "react-router-dom"

// export default function Login() {
//     return (
//         <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
//             <div className="flex items-center justify-center py-12">
//                 <div className="mx-auto grid w-[350px] gap-6">
//                     <div className="grid gap-2 text-center">
//                         <h1 className="text-3xl font-bold">Login</h1>
//                         <p className="text-balance text-muted-foreground">
//                             Digite seu e-mail abaixo para fazer login em sua conta
//                         </p>
//                     </div>
//                     <div className="grid gap-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 placeholder="m@example.com"
//                                 required
//                             />
//                         </div>
//                         <div className="grid gap-2">
//                             <div className="flex items-center">
//                                 <Label htmlFor="password">Senha</Label>
//                                 <Link
//                                     to="/forgot-password"
//                                     className="ml-auto inline-block text-sm underline"
//                                 >
//                                     Esqueceu sua senha?
//                                 </Link>
//                             </div>
//                             <Input id="password" type="password" required />
//                         </div>
//                         <Button type="submit" className="w-full">
//                             Login
//                         </Button>
//                         <Button variant="outline" className="w-full">
//                             Login with Google
//                         </Button>
//                     </div>
//                     <div className="mt-4 text-center text-sm">
//                         Ainda não tem uma conta?{" "}
//                         <Link to="#" className="underline">
//                             cadastre-se
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//             <div className="hidden bg-muted lg:block">
//                 <img
//                     src="https://png.pngtree.com/thumb_back/fw800/background/20230913/pngtree-soccer-image_13277740.jpg"
//                     alt="Image"
//                     className="max-h-dvh h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//                 />
//             </div>
//         </div>
//     )
// }
