import styles from '../pages/liga/gerenciar-jogos/gerenciarJogos.module.css';

interface IPosicoesProps {
    id: number,
    nome: string,
    classe: string
}

export function obterSistemaTatico(sistema: string): IPosicoesProps[] {
    const posicoes: { [key: string]: IPosicoesProps[] } = {
        "4-3-3": [
            { id: 1, nome: "Goleiro", classe: styles.goleiro },
            { id: 3, nome: "LD", classe: styles.lateralDireito },
            { id: 4, nome: "LE", classe: styles.lateralEsquerdo },
            { id: 16, nome: "ZE", classe: styles.zagueiroEsquerdo },
            { id: 15, nome: "ZD", classe: styles.zagueiroDireito },
            { id: 5, nome: "VOL", classe: styles.volante },
            { id: 6, nome: "MEIA", classe: styles.meia },
            { id: 7, nome: "MAT", classe: styles.meiaAtacante },
            { id: 13, nome: "PTE", classe: styles.pontaEsquerda },
            { id: 12, nome: "PTD", classe: styles.pontaDireita },
            { id: 14, nome: "CA", classe: styles.centroavante },
        ],
        "4-4-2": [
            { id: 1, nome: "Goleiro", classe: styles.goleiro },
            { id: 3, nome: "LD", classe: styles.lateralDireito },
            { id: 4, nome: "LE", classe: styles.lateralEsquerdo },
            { id: 16, nome: "ZE", classe: styles.zagueiroEsquerdo },
            { id: 15, nome: "ZD", classe: styles.zagueiroDireito },
            { id: 5, nome: "VOL", classe: styles.volante },
            { id: 6, nome: "MEIA", classe: styles.meia },
            { id: 9, nome: "MD", classe: styles.meiaDireita },
            { id: 10, nome: "ME", classe: styles.meiaEsquerda },
            { id: 14, nome: "CA", classe: styles.centroavante },
            { id: 11, nome: "SA", classe: styles.segundoAtacante },
        ],
        "3-5-2": [
            { id: 1, nome: "Goleiro", classe: styles.goleiro },
            { id: 16, nome: "ZE", classe: styles.zagueiroEsquerdo },
            { id: 2, nome: "ZC", classe: styles.zagueiro },
            { id: 15, nome: "ZD", classe: styles.zagueiroDireito },
            { id: 5, nome: "VOL", classe: styles.volante },
            { id: 6, nome: "MEIA", classe: styles.meia },
            { id: 7, nome: "MAT", classe: styles.meiaAtacante },
            { id: 9, nome: "MD", classe: styles.meiaDireita },
            { id: 10, nome: "ME", classe: styles.meiaEsquerda },
            { id: 14, nome: "CA", classe: styles.centroavante },
            { id: 11, nome: "SA", classe: styles.segundoAtacante },
        ]
    };
    return posicoes[sistema] || [];
}