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


// import { Link, useNavigate } from 'react-router-dom';
// import styles from './login.module.css';
// import { useAuth } from '../../contexts/AuthProvider/useAuth';
// import { toast } from 'react-toastify';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { loginValidationSchema } from '../../utils/loginValidation';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
// import { Label } from '../../components/ui/label';
// import { Input } from '../../components/ui/input';
// import { Button } from '../../components/ui/button';

// interface ApiErrorResponse {
//     response?: {
//         status: number,
//         data?: {
//             errors?: {
//                 default?: string;
//             };
//         };
//     };
//     message?: string;
// }

// function Login() {
//     const { authenticate } = useAuth();
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(loginValidationSchema)
//     });

//     async function onSubmit(data: { email: string, senha: string }) {
//         try {
//             const response = await authenticate(data.email, data.senha);

//             if (response.id) {
//                 navigate('/')
//             }

//         } catch (error: unknown) {
//             const apiError = error as ApiErrorResponse;
//             console.log(apiError);
//             if (apiError.response?.status === 401) {
//                 toast.error('E-mail ou senha são inválidos')
//             } else if (apiError.response?.status === 500) {
//                 toast.error('Erro interno no servidor')
//             } else if (apiError.message) {
//                 toast.error(apiError.message);
//             } else {
//                 toast.error('Ocorreu um erro desconhecido');
//             }
//         }
//     }
//     return (
//         <main className={styles.containerLogin}>
//             <form onSubmit={handleSubmit(onSubmit)}>
//             <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               required
//             />
//           </div>
//           <div className="grid gap-2">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <Link to="#" className="ml-auto inline-block text-sm underline">
//                 Forgot your password?
//               </Link>
//             </div>
//             <Input id="password" type="password" required />
//           </div>
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//           <Button variant="outline" className="w-full">
//             Login with Google
//           </Button>
//         </div>
//         <div className="mt-4 text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <Link to="#" className="underline">
//             Sign up
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//             </form>
//         </main>
//     )
// }

// export default Login;