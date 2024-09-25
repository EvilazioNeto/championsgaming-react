import * as yup from 'yup'

export const jogosValidationSchema = yup.object().shape({
    horaJogo: yup.string().required('Nome é obrigatório').min(3, 'Tamanho mínimo inválido'),
    dataJogo: yup.date().required('Data do jogo é obrigatória'),
    localJogo: yup.string().required(),
    rodada: yup.number().required()
});