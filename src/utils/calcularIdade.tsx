export function calcularIdade(dataNascimento: Date) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
  
    let idade = hoje.getUTCFullYear() - nascimento.getUTCFullYear();
    const mesAtual = hoje.getUTCMonth();
    const diaAtual = hoje.getUTCDate();
  
    const mesNascimento = nascimento.getUTCMonth();
    const diaNascimento = nascimento.getUTCDate();
  
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
  
    return idade;
  }