import * as yup from 'yup'

export const jogadorValidationSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Tamanho mínimo inválido'),
    dataNascimento: yup.date().required('Data de nascimento é obrigatória'),
    posicaoId: yup.number().required('Posição é obrigatória'),
    nacionalidade: yup.string().required('Nacionalidade é obrigatória').min(3, 'Tamanho mínimo inválido'),
    numeroCamisa: yup.number().required('Número da camisa é obrigatório').min(1, 'Número da camisa inválido').max(99, 'Número da camisa inválido'),
});