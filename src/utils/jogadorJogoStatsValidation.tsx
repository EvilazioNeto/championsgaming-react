import * as yup from 'yup';

export const jogadorJogoStatsValidationSchema = yup.object().shape({
  gols: yup
    .number()
    .typeError('Informe um número válido para a quantidade de gols')
    .required('Informe a quantidade de gols')
    .integer('A quantidade de gols deve ser um número inteiro')
    .min(0, 'A quantidade de gols não pode ser negativa'),
  assistencias: yup
    .number()
    .typeError('Informe um número válido para a quantidade de assistências')
    .required('Informe a quantidade de assistências')
    .integer('A quantidade de assistências deve ser um número inteiro')
    .min(0, 'A quantidade de assistências não pode ser negativa'),
  cartaoAmarelo: yup
    .number()
    .typeError('Informe um número válido para a quantidade de cartões amarelos')
    .required('Informe a quantidade de cartões amarelos')
    .integer('A quantidade de cartões amarelos deve ser um número inteiro')
    .min(0, 'A quantidade de cartões amarelos não pode ser negativa')
    .max(2, 'A quantidade de cartões amarelos não pode exceder 2'),
  cartaoVermelho: yup
    .number()
    .typeError('Informe um número válido para a quantidade de cartões vermelhos')
    .required('Informe a quantidade de cartões vermelhos')
    .integer('A quantidade de cartões vermelhos deve ser um número inteiro')
    .min(0, 'A quantidade de cartões vermelhos não pode ser negativa')
    .max(1, 'A quantidade de cartões vermelhos não pode exceder 1'),
});
