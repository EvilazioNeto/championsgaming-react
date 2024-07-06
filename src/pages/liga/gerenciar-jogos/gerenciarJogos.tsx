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
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ListPlayers from '../../../components/Modal/Player/ListPlayers/ListPlayers';
import { IJogador } from '../../../interfaces/Jogador';
import { obterJogadoresDoClubePorId } from '../../../services/player/playerService';
import Loading from '../../../components/Loading/Loading';
import campo from '/public/campo.avif'

function GerenciarJogos() {
    const { id } = useParams();
    const [jogos, setJogos] = useState<IJogo[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>();
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [clube1Id, setClube1Id] = useState<number | undefined>(undefined);
    const [clube2Id, setClube2Id] = useState<number | undefined>(undefined);
    const [jogadores, setJogadores] = useState<IJogador[]>([]);
    const [modalListPlayers, setModalListPlayers] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [escalacaoClube1, setEscalacaoClube1] = useState<IJogador[]>([]);

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

    const posicoes = [
        { id: 1, nome: "Goleiro", classe: styles.goleiro },
        { id: 3, nome: "LD", classe: styles.lateralDireito },
        { id: 4, nome: "LE", classe: styles.lateralEsquerdo },
        { id: 2, nome: "ZE", classe: styles.zagueiroEsquerdo },
        { id: 2, nome: "ZD", classe: styles.zagueiroDireito },
        { id: 5, nome: "VOL", classe: styles.volante },
        { id: 6, nome: "MEIA", classe: styles.meia },
        { id: 7, nome: "MAT", classe: styles.meiaAtacante },
        { id: 13, nome: "PTE", classe: styles.pontaEsquerda },
        { id: 12, nome: "PTD", classe: styles.pontaDireita },
        { id: 14, nome: "CA", classe: styles.centroavante },
    ];

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
            }
        }
    }


    useEffect(() => {
        console.log(escalacaoClube1)
    }, [escalacaoClube1])

    return (
        <>
            {loading && <Loading />}
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
                        <div className={styles.camposContainer}>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 1</p>
                                    <select name="" id="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClube1Id(Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube2Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select>
                                        <option value="">4-4-2</option>
                                        <option value="">4-3-3</option>
                                        <option value="">4-2-3-1</option>
                                        <option value="">3-5-2</option>
                                        <option value="">3-4-3</option>
                                        <option value="">4-5-1</option>
                                        <option value="">5-3-2</option>
                                        <option value="">4-2-2-2</option>
                                    </select>
                                </div>
                                <div className={styles.campoBox}>
                                    {posicoes.map((posicao, i) => (
                                        escalacaoClube1.length > 0 && escalacaoClube1[i].posicaoId === posicao.id ? (
                                            <div>{escalacaoClube1[i].nome}</div>
                                        ) :
                                        <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube1Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                            <p>{posicao.nome}</p>
                                            <FontAwesomeIcon icon={faAdd} />
                                        </div>
                                    ))}
                                    <img className={styles.campoImg} src={campo} alt="" />
                                </div>

                            </div>
                            <div className={styles.placar}>
                                <h2>0 x 0</h2>
                            </div>
                            <div className={styles.campo}>
                                <div>
                                    <p>Clube 2</p>
                                    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClube2Id(Number(e.target.value))}>
                                        {arrClubs.map((clube) => (
                                            clube.id !== clube1Id &&
                                            <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                        ))}
                                    </select>
                                    <select>
                                        <option value="">4-4-2</option>
                                        <option value="">4-3-3</option>
                                        <option value="">4-2-3-1</option>
                                        <option value="">3-5-2</option>
                                        <option value="">3-4-3</option>
                                        <option value="">4-5-1</option>
                                        <option value="">5-3-2</option>
                                        <option value="">4-2-2-2</option>
                                    </select>
                                </div>
                                <div className={styles.campoBox}>
                                    {posicoes.map((posicao, i) => (
                                        <div key={i} onClick={() => obterJogadorDoClube(posicao.id, clube2Id)} className={`${posicao.classe} ${styles.jogador}`}>
                                            <p>{posicao.nome}</p>
                                            <FontAwesomeIcon icon={faAdd} />
                                        </div>
                                    ))}
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
