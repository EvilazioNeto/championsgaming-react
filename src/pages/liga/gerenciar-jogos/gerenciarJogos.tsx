import { useParams } from 'react-router-dom';
import styles from './gerenciarJogos.module.css';
import { useEffect, useState } from 'react';
import { Api } from '../../../services/api/axios-config';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { IJogo } from '../../../interfaces/Jogos';
import { IClube } from '../../../interfaces/Clube';
import { IClubeCampeonato } from '../../../interfaces/ClubeCampeonato';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import ListPlayers from '../../../components/Modal/Player/ListPlayers/ListPlayers';
import { IJogador } from '../../../interfaces/Jogador';
import { obterJogadoresDoClubePorId } from '../../../services/player/playerService';
import Loading from '../../../components/Loading/Loading';
import campo from '/campo.avif'
import { IJogadorJogo } from '../../../interfaces/JogadorJogo';
import PlayerStats from '../../../components/Modal/Player/PlayerStats/PlayerStats';
import { obterSistemaTatico } from '../../../utils/obterSistemaTatico';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { jogosValidationSchema } from '../../../utils/jogoValidation';
import { formatToDate } from '../../../utils/formatToDate';
import { toast } from 'react-toastify';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { getCampeonatoEstatisticas } from '../../../services/club/clubService';

interface IPosicoesProps {
    id: number,
    nome: string,
    classe: string
}

function GerenciarJogos() {
    const [clubeCampStats, setClubeCampStats] = useState<IClubeCampeonato[]>([]);
    const [rodada, setRodada] = useState<number>(1)
    const { id } = useParams();
    const [jogos, setJogos] = useState<IJogo[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>();
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [clube1Id, setClube1Id] = useState<number | undefined>(undefined);
    const [clube2Id, setClube2Id] = useState<number | undefined>(undefined);
    const [jogadores, setJogadores] = useState<IJogador[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [escalacaoClube1, setEscalacaoClube1] = useState<IJogador[]>([]);
    const [jogadoresJogosStats, setJogadoresJogosStats] = useState<Omit<IJogadorJogo, 'id' | 'jogoId'>[]>([]);
    const [escalacaoClube2, setEscalacaoClube2] = useState<IJogador[]>([]);
    const [jogadorSelecionadoStats, setJogadorSelecionadoStats] = useState<Omit<IJogadorJogo, 'id' | 'jogoId'>>({} as IJogadorJogo);
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

    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<IJogo, 'id' | 'clube1Id' | 'clube2Id' | 'golClube1' | 'golClube2' | 'campeonatoId' | 'rodada' | 'tipoJogo'>>({
        resolver: yupResolver(jogosValidationSchema)
    })

    // useEffect(() => {
    //     console.log(jogadoresJogosStats)
    // }, [jogadoresJogosStats])

    useEffect(() => {
        async function obterJogos() {
            try {
                const response = await Api.get(`/campeonatos/${idToNumber}/jogos`)
                if (response.status === 200) {
                    const jogosRodada = response.data.filter((jogoRodata: IJogo) => jogoRodata.rodada === 1)
                    setJogos(jogosRodada)
                }
            } catch (error) {
                console.log(error)
            }
        }
        obterJogos()
    }, []);

    let idToNumber: number
    if (id) {
        idToNumber = parseInt(id)
    }

    useEffect(() => {
        async function obterDados() {
            try {
                setLoading(true)
                const response = await Api.get(`/campeonatos/${id}`)

                if (response.status === 200 && id) {
                    setCampeonato(response.data)

                    const infoTabela = await getCampeonatoEstatisticas(idToNumber);

                    if (infoTabela instanceof Error) {
                        return;
                    }
                    setClubeCampStats(infoTabela)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            }
        } else {
            const jogadorJaEscalado = escalacaoClube2.find((jogadorEscalado) => jogadorEscalado.id === jogador.id);
            if (!jogadorJaEscalado) {
                setEscalacaoClube2([...escalacaoClube2, jogador]);
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

    function atualizarStatsJogador(clube: string) {
        if (clube === "clube1") {
            const jogadoresStats = jogadoresJogosStats.filter((jogadorStats) =>
                escalacaoClube1.some((jogEscalados) => jogadorStats.jogadorId === jogEscalados.id)
            );

            setJogadoresJogosStats(jogadoresStats);
        } else if (clube === "clube2") {
            const jogadoresStats = jogadoresJogosStats.filter((jogadorStats) =>
                escalacaoClube2.some((jogEscalados) => jogadorStats.jogadorId === jogEscalados.id)
            );

            setJogadoresJogosStats(jogadoresStats);
        }
    }

    function selecionarJogadorStats(jogador: IJogador) {
        const jogadorStats = jogadoresJogosStats.find((jogadorStats) => jogadorStats.jogadorId === jogador.id)
        if (jogadorStats) {
            setJogadorSelecionadoStats(jogadorStats)
        }
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


    async function onSubmit(dados: Omit<IJogo, 'id' | 'clube1Id' | 'clube2Id' | 'golClube1' | 'golClube2' | 'campeonatoId' | 'rodada' | 'tipoJogo'>) {
        if (escalacaoClube1.length < 11 && escalacaoClube2.length < 11) {
            toast.error("Escale todos os jogadores")
        } else {
            if (clube1Id && clube2Id) {
                const jogo: Omit<IJogo, 'id'> = {
                    campeonatoId: idToNumber,
                    clube1Id: clube1Id,
                    clube2Id: clube2Id,
                    dataJogo: formatToDate(dados.dataJogo),
                    horaJogo: dados.horaJogo,
                    localJogo: dados.localJogo,
                    rodada: rodada,
                    golClube2: golsClube2,
                    golClube1: golsClube1,
                    tipoJogo: 'ida'
                }
                try {
                    const response = await Api.post(`/jogos`, jogo)

                    if (response.status === 201) {
                        const statsClube1 = clubeCampStats.find((clubeStats) => clubeStats.clubeId === clube1Id)
                        const statsClube2 = clubeCampStats.find((clubeStats) => clubeStats.clubeId === clube2Id)

                        if (statsClube1 && statsClube2) {
                            let dadosAtt1: Omit<IClubeCampeonato, 'id' | 'clubeId' | 'campeonatoId'> = {
                                golsPro: statsClube1?.golsPro + golsClube1,
                                golsContra: statsClube1?.golsContra + golsClube2,
                                vitorias: statsClube1.vitorias,
                                derrotas: statsClube1.derrotas,
                                empates: statsClube1.empates,
                                cartoesAmarelos: 0,
                                cartoesVermelhos: 0
                            }
                            let dadosAtt2: Omit<IClubeCampeonato, 'id' | 'clubeId' | 'campeonatoId'> = {
                                golsPro: statsClube2?.golsPro + golsClube2,
                                golsContra: statsClube2?.golsContra + golsClube1,
                                vitorias: statsClube2.vitorias,
                                derrotas: statsClube2.derrotas,
                                empates: statsClube2.empates,
                                cartoesAmarelos: 0,
                                cartoesVermelhos: 0
                            }

                            if (golsClube1 > golsClube2) {
                                dadosAtt1 = {
                                    ...dadosAtt1,
                                    vitorias: statsClube1.vitorias + 1
                                };
                                dadosAtt2 = {
                                    ...dadosAtt2,
                                    derrotas: statsClube2.derrotas + 1
                                };
                            } else if (golsClube2 > golsClube1) {
                                dadosAtt2 = {
                                    ...dadosAtt2,
                                    vitorias: statsClube2.vitorias + 1
                                };
                                dadosAtt1 = {
                                    ...dadosAtt1,
                                    derrotas: statsClube1.derrotas + 1
                                };
                            } else {
                                dadosAtt1 = {
                                    ...dadosAtt1,
                                    empates: statsClube1.empates + 1
                                };
                                dadosAtt2 = {
                                    ...dadosAtt2,
                                    empates: statsClube2.empates + 1
                                };
                            }

                            const response1 = await Api.put(`/clubes-campeonatos/${statsClube1.id}`, dadosAtt1)
                            const response2 = await Api.put(`/clubes-campeonatos/${statsClube2.id}`, dadosAtt2)

                            if (response1.status === 200 && response2.status === 200) {
                                await attDados()

                                const jogadoresStatsComJogoId: Omit<IJogadorJogo, 'id'>[] = jogadoresJogosStats.map((jogadorStats) => ({
                                    ...jogadorStats,
                                    jogoId: response.data
                                }))

                                const promessas = jogadoresStatsComJogoId.map((jogadorStats: Omit<IJogadorJogo, 'id'>) => {
                                    return Api.post(`/jogadores-jogos`, jogadorStats);
                                })
                                const responses = await Promise.all(promessas);

                                let jogadores: number[] = []
                                responses.forEach((promessa) => {
                                    if (promessa.status === 201) {
                                        jogadores = [...jogadores, promessa.data]
                                    }
                                })
                                toast.success("Jogo criado com sucesso")
                                reset();

                            } else {
                                toast.error("Erro ao criar jogo")
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    const attDados = async () => {
        const infoTabela = await getCampeonatoEstatisticas(idToNumber);
        if (infoTabela instanceof Error) {
            return;
        }
        setClubeCampStats(infoTabela);
    };

    async function handleRodadas(rodada: number) {
        setRodada(rodada)
        try {
            const response = await Api.get(`/campeonatos/${idToNumber}/jogos`)
            if (response.status === 200) {
                const jogosRodada = response.data.filter((jogoRodata: IJogo) => jogoRodata.rodada === rodada)
                setJogos(jogosRodada)
            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao buscar jogos")
        }
    }


    return (
        <>
            {loading && <Loading />}
            <main className={styles.gerenciarJogosContainer}>
                <section>
                    {/* <div className={styles.rodadasBox}>
                        <h2>JOGOS</h2>
                        <select className={styles.selecionarRodada} onChange={(e) => handleRodadas(Number(e.target.value))}>
                            {campeonato && Array.from({ length: campeonato?.numeroRodadas }, (_, i) => (
                                <option value={i + 1} key={i}>{i + 1}° rodada</option>
                            ))}
                        </select>
                        <div className={styles.jogosBox}>
                            {jogos.length > 0 ? (
                                jogos.map((jogo) => {
                                    const clube1 = arrClubs.find((clube) => clube.id === jogo.clube1Id);
                                    const clube2 = arrClubs.find((clube) => clube.id === jogo.clube2Id);
                                    return clube1 && clube2 && (
                                        <div key={jogo.id} className={styles.jogo}>
                                            <p>{clube1.nome} {jogo.golClube1} x {jogo.golClube2} {clube2.nome}</p>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className={styles.empty}>
                                    <h2>Nenhum jogo encontrado</h2>
                                    <img src="https://www.shutterstock.com/image-vector/illustration-deflated-football-soccer-ball-600nw-2301467351.jpg" alt="" />
                                </div>
                            )}
                        </div>
                    </div> */}
                    <div className={styles.jogoContainer}>
                        <div className={styles.placar}>
                            <h2 className='text-xl'>{golsClube1} x {golsClube2}</h2>
                        </div>
                        <div className={styles.camposContainer}>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 1</p>
                                    <select className='bg-transparent border rounded-lg border-cyan-950' name="" id="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeClub("clube1", Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube2Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select className='bg-transparent border rounded-lg border-cyan-950' onChange={(e) => handleSistemaTatico(e.target.value, "clube1")}>
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
                                                <PlayerStats jogador={jogadorEscalado} selecionarJogadorStats={() => selecionarJogadorStats(jogadorEscalado)} jogadorStats={jogadorSelecionadoStats} handleJogadorStats={handleJogadorStats} />
                                                <FontAwesomeIcon icon={faX} className={styles.removePlayer} onClick={() => removePlayer(jogadorEscalado)} />
                                            </div>
                                        ) : (
                                            <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube1Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{posicao.nome}</p>
                                                <ListPlayers selecionarJogador={selecionarJogador} jogadores={jogadores} />
                                            </div>
                                        );
                                    })}
                                    <img className={styles.campoImg} src={campo} alt="" />
                                </div>

                            </div>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 2</p>
                                    <select className='bg-transparent border rounded-lg border-cyan-950' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeClub("clube2", Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube1Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select className='bg-transparent border rounded-lg border-cyan-950' onChange={(e) => handleSistemaTatico(e.target.value, "clube2")}>
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
                                                <PlayerStats jogador={jogadorEscalado} selecionarJogadorStats={() => selecionarJogadorStats(jogadorEscalado)} jogadorStats={jogadorSelecionadoStats} handleJogadorStats={handleJogadorStats} />
                                                <FontAwesomeIcon icon={faX} className={styles.removePlayer} onClick={() => removePlayer(jogadorEscalado)} />
                                            </div>
                                        ) : (
                                            <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube2Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                                <p>{posicao.nome}</p>
                                                <ListPlayers selecionarJogador={selecionarJogador} jogadores={jogadores} />
                                            </div>
                                        );
                                    })}
                                    <img className={styles.campoImg} src={campo} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.detalhesJogo}>
                            <form className='flex items-center' onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <p>Local do jogo</p>
                                    <Input   {...register('localJogo')} type="text" placeholder='Ex: Camp Nou' />
                                    <div className={styles.msgError}>{errors.localJogo?.message}</div>
                                </div>
                                <div>
                                    <p>Data jogo:</p>
                                    <Input type="date"   {...register('dataJogo')} />
                                    <div className={styles.msgError}>{typeof errors.dataJogo?.message === 'string' && errors.dataJogo?.message}</div>
                                </div>
                                <div>
                                    <p>Horario do jogo</p>
                                    <Input type="time"   {...register('horaJogo')} />
                                    <div className={styles.msgError}>{typeof errors.horaJogo?.message === 'string' && errors.horaJogo?.message}</div>
                                </div>
                                <Button>CRIAR JOGO</Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default GerenciarJogos;
