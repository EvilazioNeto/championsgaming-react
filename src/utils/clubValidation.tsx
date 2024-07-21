import * as yup from 'yup'

export const clubValidationSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Tamanho mínimo inválido'),
    mascote: yup.string().required('Adicione o nome do mascote').min(3, 'Tamanho mínimo inválido'),
    cor_principal: yup.string().required('Adicione uma cor principal').min(1, 'Tamanho mínimo inválido'),
    cor_secundaria: yup.string().required('Adicione uma cor secundaria').min(1, 'Tamanho mínimo inválido'),
    fotoUrl: yup.string().required('Anexe uma foto')
})