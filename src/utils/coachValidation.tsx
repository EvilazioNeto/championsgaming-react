import * as yup from 'yup'

export const coachValidationSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Tamanho mínimo inválido'),
    dataNascimento: yup.date().required('Data de nascimento é obrigatória'),
    nacionalidade: yup.string().required('Nacionalidade é obrigatória').min(3, 'Tamanho mínimo inválido'),
    fotoUrl: yup.string().required('Anexe uma foto')
});