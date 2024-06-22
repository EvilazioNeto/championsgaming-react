import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
    email: yup.string().email('E-mail deve ser válido').required('E-mail é obrigatório').matches(/\S+@\S+\.\S+/, 'E-mail deve ser válido'),
    senha: yup.string().required('Senha é obrigatória').min(8, 'Tamanho mínimo inválido'),
})