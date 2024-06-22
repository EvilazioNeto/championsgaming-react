import * as yup from 'yup'

export const cadastroValidationSchema = yup.object().shape({
    nome: yup.string().required('Nome completo é obrigatório').min(3, 'Tamanho mínimo inválido'),
    email: yup.string().email('E-mail deve ser válido').required('E-mail é obrigatório').matches(/\S+@\S+\.\S+/, 'E-mail deve ser válido'),
    senha: yup.string().required('Senha é obrigatória').min(8, 'Tamanho mínimo inválido'),
})