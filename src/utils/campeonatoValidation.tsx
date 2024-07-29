import * as yup from 'yup'

export const campeonatoValidationSchema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(3, 'Tamanho mínimo inválido'),
    dataInicio: yup.string().required('Informe a data de inicio do campeonato'),
    dataFim: yup.string().required('Informe a data do fim do campeonato'),
    fotoUrl: yup.string().required(),
    quantidadeTimes: yup.number().required()
})