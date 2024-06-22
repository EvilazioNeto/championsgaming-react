import { Link } from 'react-router-dom';
import styles from './cadastro.module.css';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { cadastroValidationSchema } from '../../utils/cadastroValidation';
import { Api } from '../../services/api/axios-config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

function Cadastro() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(cadastroValidationSchema)
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
        <main className={styles.containerCadastro}>
            <form className={styles.formCadastro} onSubmit={handleSubmit(onSubmit)}>
                <h2>CADASTRE-SE</h2>
                <div>
                    <p>Nome:</p>
                    <input
                        type="text"
                        {...register('nome')}
                    />
                    <div className={styles.msgError}>{errors.nome?.message}</div>
                </div>
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
                <button className={styles.cadastroBtn}>CADASTRE-SE</button>
                <div className={styles.links}>
                    <Link to="/login">
                        Já tem uma conta?
                    </Link>
                </div>
            </form>
        </main>
    )
}

export default Cadastro;
