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
                navigate('/home')
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
