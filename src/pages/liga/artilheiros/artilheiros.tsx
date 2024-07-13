import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../../../services/api/axios-config";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { IClube } from "../../../interfaces/Clube";
import { IJogadorJogo } from "../../../interfaces/JogadorJogo";
import { IJogador } from "../../../interfaces/Jogador";

interface IjogadorStatsProps {
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    gols: number;
    jogadorId: number;
    nome: string;
}

function Artilheiros() {
    const { id } = useParams();
    const [jogadoresStats, setJogadoresStats] = useState<IjogadorStatsProps[]>([])

    useEffect(() => {
        async function obterDados() {
            try {
                const response = await Api.get(`/campeonatos/${id}`);

                if (response.status === 200 && id) {
                    const infoTabela = await getCampeonatoEstatisticas(Number(id));

                    if (infoTabela instanceof Error) {
                        return;
                    }

                    const promessas = infoTabela.map((info: IClubeCampeonato) => {
                        return Api.get(`/clubes/${info.clubeId}`);
                    });

                    const responses = await Promise.all(promessas);

                    let clubes: IClube[] = [];
                    responses.forEach((res) => {
                        if (res.status === 200) {
                            clubes = [...clubes, res.data];
                        }
                    });

                    const jogadoresPromessas = clubes.map((clube: IClube) => {
                        return Api.get(`/clubes/${clube.id}/jogadores`);
                    });

                    const jogadoresRes = await Promise.all(jogadoresPromessas);

                    let jogadores: IJogador[] = [];
                    jogadoresRes.forEach((res) => {
                        if (res.status === 200) {
                            jogadores = [...jogadores, ...res.data];
                        }
                    });

                    const jogadoresStatsPromessas = jogadores.map((jogador: IJogador) => {
                        return Api.get(`/jogadores/${jogador.id}/jogos`);
                    });

                    const jogadorStatsRes = await Promise.all(jogadoresStatsPromessas);
                    let jogadoresStats: IJogadorJogo[] = [];
                    jogadorStatsRes.forEach((res) => {
                        if (res.status === 200) {
                            if (res.data.length > 0) {
                                jogadoresStats = [...jogadoresStats, ...res.data];
                            }
                        }
                    });

                    const jogadoresGols: { [key: number]: { gols: number, assistencias: number, nome: string, cartoesAmarelos: number, cartoesVermelhos: number } } = {};
                    jogadoresStats.forEach((jogadorStats) => {
                        if (!jogadoresGols[jogadorStats.jogadorId]) {
                            jogadoresGols[jogadorStats.jogadorId] = { gols: 0, assistencias: 0, nome: '', cartoesAmarelos: 0, cartoesVermelhos: 0 };
                        }
                        jogadoresGols[jogadorStats.jogadorId].gols += jogadorStats.gols;
                        jogadoresGols[jogadorStats.jogadorId].assistencias += jogadorStats.assistencias;
                        jogadoresGols[jogadorStats.jogadorId].cartoesAmarelos += jogadorStats.cartaoAmarelo;
                        jogadoresGols[jogadorStats.jogadorId].cartoesVermelhos += jogadorStats.cartaoVermelho;
                        jogadores.map((jogador) => {
                            if (jogador.id === jogadorStats.jogadorId) {
                                jogadoresGols[jogadorStats.jogadorId].nome = jogador.nome
                            }
                        })
                    });

                    const jogadoresGolsArray = Object.keys(jogadoresGols).map((jogadorId) => ({
                        jogadorId: Number(jogadorId),
                        ...jogadoresGols[Number(jogadorId)]
                    }));

                    setJogadoresStats(jogadoresGolsArray.sort((a, b) => {
                        if (b.gols !== a.gols) {
                            return b.gols - a.gols;
                        } else {
                            return a.nome.localeCompare(b.nome);
                        }
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
        obterDados();
    }, [id]);

    useEffect(() =>{
        console.log(jogadoresStats)
    }, [jogadoresStats])

    return (
        <main>

        </main>
    )
}

export default Artilheiros;
