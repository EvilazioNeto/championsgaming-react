export interface IJogo {
    id: number;
    campeonatoId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataJogo: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    horaJogo: any;
    clube1Id: number;
    golClube1: number;
    clube2Id: number;
    golClube2: number;
    localJogo: string;
    rodada: number;
    tipoJogo: string
}


