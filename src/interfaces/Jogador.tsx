export interface IJogador {
    id: number;
    clubeId: number;
    nome: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataNascimento: any; 
    posicaoId: number;
    nacionalidade: string;
    numeroCamisa: number;
}