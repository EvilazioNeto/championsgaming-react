import { useParams } from 'react-router-dom';
import styles from './gerenciarJogos.module.css';
import { useEffect, useState } from 'react';
import { Api } from '../../../services/api/axios-config';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { IJogo } from '../../../interfaces/Jogos';
import { IClube } from '../../../interfaces/Clube';
import { IClubeCampeonato } from '../../../interfaces/ClubeCampeonato';
import { getCampeonatoEstatisticas } from '../../../services/api/club/clubService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faUserEdit, faX } from '@fortawesome/free-solid-svg-icons';
import ListPlayers from '../../../components/Modal/Player/ListPlayers/ListPlayers';
import { IJogador } from '../../../interfaces/Jogador';
import { obterJogadoresDoClubePorId } from '../../../services/player/playerService';
import Loading from '../../../components/Loading/Loading';
import campo from '/campo.avif'
import { IJogadorJogo } from '../../../interfaces/JogadorJogo';
import PlayerStats from '../../../components/Modal/Player/PlayerStats/PlayerStats';
import { obterSistemaTatico } from '../../../utils/obterSistemaTatico';

interface IPosicoesProps {
    id: number,
    nome: string,
    classe: string
}

function GerenciarJogos() {
    const { id } = useParams();
    const [jogos, setJogos] = useState<IJogo[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>();
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [clube1Id, setClube1Id] = useState<number | undefined>(undefined);
    const [clube2Id, setClube2Id] = useState<number | undefined>(undefined);
    const [jogadores, setJogadores] = useState<IJogador[]>([]);
    const [modalListPlayers, setModalListPlayers] = useState<boolean>(false);
    const [modalPlayerStats, setModalPlayerStats] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [escalacaoClube1, setEscalacaoClube1] = useState<IJogador[]>([]);
    const [jogadoresJogosStats, setJogadoresJogosStats] = useState<Omit<IJogadorJogo, 'id' | 'jogoId'>[]>([]);
    const [escalacaoClube2, setEscalacaoClube2] = useState<IJogador[]>([]);
    const [jogadorSelecionadoStats, setJogadorSelecionadoStats] = useState<Omit<IJogadorJogo, 'id' | 'jogoId'>>();
    const [golsClube1, setGolsClube1] = useState<number>(0);
    const [golsClube2, setGolsClube2] = useState<number>(0);
    const [posicoesClube1, setPosicoesClube1] = useState<IPosicoesProps[]>([
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
    ])
    const [posicoesClube2, setPosicoesClube2] = useState<IPosicoesProps[]>([
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
    ])

    useEffect(() => {
        async function obterDados() {
            try {
                setLoading(true)
                const response = await Api.get(`/campeonatos/${id}`)

                if (response.status === 200 && id) {
                    setCampeonato(response.data)
                    const idToNumber = parseInt(id)

                    const infoTabela = await getCampeonatoEstatisticas(idToNumber);

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
                    setArrClubs(clubes);

                    if (clube1Id === undefined || clube1Id === null) {
                        setClube1Id(clubes[0].id)
                    }

                    if (clube2Id === undefined || clube2Id === null) {
                        setClube2Id(clubes[1].id)
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        obterDados()
    }, [id, clube1Id, clube2Id]);

    
    function handleSistemaTatico(sistema: string, clube: string) {
        const novoSistema = obterSistemaTatico(sistema);
        if (clube === 'clube1') {
            atualizarStatsJogador("clube2");
            setEscalacaoClube1([]);
            setPosicoesClube1(novoSistema);
        } else if (clube === "clube2") {
            atualizarStatsJogador("clube1");
            setEscalacaoClube2([]);
            setPosicoesClube2(novoSistema);
        }
    }

    async function obterJogadorDoClube(posicaoId: number, clubeId?: number) {
        if (clubeId) {
            const response = await obterJogadoresDoClubePorId(clubeId)
            if (response instanceof Error) {
                return;
            }

            let jogadores: IJogador[] = []
            response.map((jogador) => {
                if (jogador.posicaoId === posicaoId) {
                    jogadores = [...jogadores, jogador]
                }
            })
            setJogadores(jogadores);
            setModalListPlayers(true);
        }
    }

    async function selecionarJogador(jogador: IJogador): Promise<void> {
        if (jogador.clubeId === clube1Id) {
            const jogadorJaEscalado = escalacaoClube1.find((jogadorEscalado) => jogadorEscalado.id === jogador.id);
            if (!jogadorJaEscalado) {
                setEscalacaoClube1([...escalacaoClube1, jogador]);
                const jogadorJogoStats: Omit<IJogadorJogo, 'id' | 'jogoId'> = {
                    gols: 0,
                    assistencias: 0,
                    cartaoAmarelo: 0,
                    cartaoVermelho: 0,
                    jogadorId: jogador.id
                }
                setJogadoresJogosStats([...jogadoresJogosStats, jogadorJogoStats])
                setModalListPlayers(false)
            }
        } else {
            const jogadorJaEscalado = escalacaoClube2.find((jogadorEscalado) => jogadorEscalado.id === jogador.id);
            if (!jogadorJaEscalado) {
                setEscalacaoClube2([...escalacaoClube2, jogador]);
                setModalListPlayers(false);
                const jogadorJogoStats: Omit<IJogadorJogo, 'id' | 'jogoId'> = {
                    gols: 0,
                    assistencias: 0,
                    cartaoAmarelo: 0,
                    cartaoVermelho: 0,
                    jogadorId: jogador.id
                }
                setJogadoresJogosStats([...jogadoresJogosStats, jogadorJogoStats])
            }
        }
    }

    function removePlayer(jogador: IJogador) {
        if (jogador.clubeId === clube1Id) {
            const i = escalacaoClube1.indexOf(jogador);
            escalacaoClube1.splice(i, 1)
            setEscalacaoClube1([...escalacaoClube1])

        } else {
            const i = escalacaoClube2.indexOf(jogador);
            escalacaoClube2.splice(i, 1)
            setEscalacaoClube2([...escalacaoClube2])
        }

        const JogadorJogoStats = jogadoresJogosStats.find((jogadorStats) => jogadorStats.jogadorId === jogador.id)
        if (JogadorJogoStats) {
            const indexJogadorJogoStats = jogadoresJogosStats.indexOf(JogadorJogoStats)
            jogadoresJogosStats.splice(indexJogadorJogoStats, 1);
            setJogadoresJogosStats([...jogadoresJogosStats])
        }
    }

    function handleChangeClub(posicaoClube: string, clubeId: number) {
        if (posicaoClube === "clube1") {
            setClube1Id(clubeId);
            setEscalacaoClube1([]);
            atualizarStatsJogador("clube2")

        } else if (posicaoClube === "clube2") {
            setClube2Id(clubeId);
            setEscalacaoClube2([]);
            atualizarStatsJogador("clube1")
        }
    }

    function atualizarStatsJogador(clube: string){
        if(clube === "clube1"){
            const jogadoresStats = jogadoresJogosStats.filter((jogadorStats) =>
                escalacaoClube1.some((jogEscalados) => jogadorStats.jogadorId === jogEscalados.id)
            );

            setJogadoresJogosStats(jogadoresStats);
        }else if(clube === "clube2"){
            const jogadoresStats = jogadoresJogosStats.filter((jogadorStats) =>
                escalacaoClube2.some((jogEscalados) => jogadorStats.jogadorId === jogEscalados.id)
            );

            setJogadoresJogosStats(jogadoresStats);
        }
    }

    function selecionarJogadorStats(jogador: IJogador) {
        const jogadorStats = jogadoresJogosStats.find((jogadorStats) => jogadorStats.jogadorId === jogador.id)
        setJogadorSelecionadoStats(jogadorStats)
        setModalPlayerStats(true)
    }

    function handleJogadorStats(jogStats: Omit<IJogadorJogo, 'id' | 'jogoId'>) {
        const jogadorStats = jogadoresJogosStats.filter((jog) => jog.jogadorId === jogStats.jogadorId)
        const i = jogadoresJogosStats.indexOf(jogadorStats[0]);
        jogadoresJogosStats.splice(i, 1);
        setJogadoresJogosStats([...jogadoresJogosStats, jogStats])
        handleGols();

    }

    useEffect(() => {
        handleGols();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        console.log(jogadoresJogosStats)
    }, [jogadoresJogosStats]);

    function handleGols() {
        let qtdGolsClube1: number = 0;
        let qtdGolsClube2: number = 0;

        jogadoresJogosStats.map((jog) => {
            escalacaoClube1.map((jogadorEscalado) => {
                if (jogadorEscalado.id === jog.jogadorId) {
                    qtdGolsClube1 += jog.gols
                }
            })
        })

        jogadoresJogosStats.map((jog) => {
            escalacaoClube2.map((jogadorEscalado) => {
                if (jogadorEscalado.id === jog.jogadorId) {
                    qtdGolsClube2 += jog.gols
                }
            })
        })

        setGolsClube1(qtdGolsClube1);
        setGolsClube2(qtdGolsClube2);
    }

    return (
        <>
            {loading && <Loading />}
            {modalPlayerStats && <PlayerStats handleJogadorStats={handleJogadorStats} jogadorStats={jogadorSelecionadoStats} fecharModal={() => setModalPlayerStats(false)} />}
            {modalListPlayers && <ListPlayers selecionarJogador={selecionarJogador} fecharModal={() => setModalListPlayers(false)} jogadores={jogadores} />}
            <main className={styles.gerenciarJogosContainer}>
                <section>
                    <div className={styles.rodadasBox}>
                        <select className={styles.selecionarRodada} name="" id="">
                            {campeonato && Array.from({ length: campeonato?.numeroRodadas }, (_, i) => (
                                <option key={i}>{i + 1}° rodada</option>
                            ))}
                        </select>
                        <button className={styles.addJogoBtn}>NOVO JOGO</button>
                        <div className={styles.jogosBox}>
                            {jogos.length > 0 ? (
                                <div>

                                </div>
                            ) : (
                                <div className={styles.empty}>
                                    <h2>Nenhum jogo encontrado</h2>
                                    <img src="https://www.shutterstock.com/image-vector/illustration-deflated-football-soccer-ball-600nw-2301467351.jpg" alt="" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.jogoContainer}>
                        <div className={styles.placar}>
                            <h2>{golsClube1} x {golsClube2}</h2>
                        </div>
                        <div className={styles.camposContainer}>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 1</p>
                                    <select name="" id="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeClub("clube1", Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube2Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select onChange={(e) => handleSistemaTatico(e.target.value, "clube1")}>
                                        <option value="4-3-3">4-3-3</option>
                                        <option value="4-4-2">4-4-2</option>
                                        <option value="3-5-2">3-5-2</option>
                                    </select>
                                </div>
                                <div className={styles.campoBox}>
                                    {posicoesClube1.map((posicao, i) => {
                                        const jogadorEscalado = escalacaoClube1.find((jogador) => jogador.posicaoId === posicao.id);
                                        return jogadorEscalado ? (
                                            <div key={i} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{jogadorEscalado.nome}</p>
                                                <FontAwesomeIcon icon={faUserEdit} onClick={() => selecionarJogadorStats(jogadorEscalado)} />
                                                <FontAwesomeIcon icon={faX} className={styles.removePlayer} onClick={() => removePlayer(jogadorEscalado)} />
                                            </div>
                                        ) : (
                                            <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube1Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{posicao.nome}</p>
                                                <FontAwesomeIcon icon={faAdd} />
                                            </div>
                                        );
                                    })}
                                    <img className={styles.campoImg} src={campo} alt="" />
                                </div>

                            </div>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 2</p>
                                    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeClub("clube2", Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube1Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select onChange={(e) => handleSistemaTatico(e.target.value, "clube2")}>
                                        <option value="4-3-3">4-3-3</option>
                                        <option value="4-4-2">4-4-2</option>
                                        <option value="3-5-2">3-5-2</option>
                                    </select>
                                </div>
                                <div className={styles.campoBox}>
                                    {posicoesClube2.map((posicao, i) => {
                                        const jogadorEscalado = escalacaoClube2.find((jogador) => jogador.posicaoId === posicao.id);
                                        return jogadorEscalado ? (
                                            <div key={i} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{jogadorEscalado.nome}</p>
                                                <FontAwesomeIcon icon={faUserEdit} onClick={() => selecionarJogadorStats(jogadorEscalado)} />
                                                <FontAwesomeIcon icon={faX} className={styles.removePlayer} onClick={() => removePlayer(jogadorEscalado)} />
                                            </div>
                                        ) : (
                                            <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube2Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{posicao.nome}</p>
                                                <FontAwesomeIcon icon={faAdd} />
                                            </div>
                                        );
                                    })}
                                    <img className={styles.campoImg} src={campo} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default GerenciarJogos;
