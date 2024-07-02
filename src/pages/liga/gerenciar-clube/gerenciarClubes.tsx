import { useEffect, useState } from 'react';
import styles from './gerenciarClube.module.css';
import { IClube } from '../../../interfaces/Clube';
import { IClubeCampeonato } from '../../../interfaces/ClubeCampeonato';
import { Api } from '../../../services/api/axios-config';
import { toast } from 'react-toastify';
import { ICampeonato } from '../../../interfaces/Campeonato';
import AddClub from '../../../components/Modal/Club/AddClub/AddClub';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUserEdit, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import { useParams } from 'react-router-dom';
import AddPlayer from '../../../components/Modal/Player/AddPlayer/AddPlayer';
import { IJogador } from '../../../interfaces/Jogador';
import { formatToDate } from '../../../utils/formatToDate';
import { IPosicao } from '../../../interfaces/Posicao';
import UpdatePlayer from '../../../components/Modal/Player/UpdatePlayer/UpdatePlayer';
import { calcularIdade } from '../../../utils/calcularIdade';
import Loading from '../../../components/Loading/Loading';
import UpdateClub from '../../../components/Modal/Club/UpdateClub/UpdateClub';
import { atualizarJogadorPorId, criarJogador, deletarJogadorPorId, obterJogadoresDoClubePorId, obterPosicoes } from '../../../services/player/playerService';
import { criarClube, criarClubeCampeonatoEstatisticas, deletarCampeonatoClubeEstatisticas, deletarClubePorId, getCampeonatoEstatisticas } from '../../../services/api/club/clubService';

function GerenciarClubes() {
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedPlayer, setSelectedPlayer] = useState<IJogador | null>(null);
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [clubeSelecionado, setClubeSelecionado] = useState<IClube | null>(null)
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato);
    const [modal, setModal] = useState<boolean>(false);
    const [modalPlayer, setModalPlayer] = useState<boolean>(false);
    const [modalUpdatePlayer, setModalUpdatePlayer] = useState<boolean>(false);
    const [modalUpdateClub, setModalUpdateCLub] = useState<boolean>(false);
    const [clubeId, setClubeId] = useState<number>();
    const [jogadores, setJogadores] = useState<IJogador[]>([])
    const { id } = useParams();
    const auth = useAuth();
    const [posicoes, setPosicoes] = useState<IPosicao[]>([])

    useEffect(() => {
        setLoading(true);
        obterPosicoes().then(data => {
            setPosicoes(data);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        async function obterDados() {
            try {
                setLoading(true)
                const response = await Api.get(`/campeonatos/${id}`)

                if (response.status === 200) {
                    setCampeonato(response.data);

                    const infoTabela = await Api.get(`/campeonatos/${response.data.id}/clubes`);
                    const promessas = infoTabela.data.map((info: IClubeCampeonato) => {
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

                    if (clubes.length > 0) {
                        setClubeSelecionado(clubes[0])
                        const playerResponse = await obterJogadoresDoClubePorId(clubes[0].id)

                        if (playerResponse instanceof Error) {
                            return;
                        } else {
                            setJogadores(playerResponse)
                        }
                    }
                    setLoading(false)
                }
                setLoading(false)

            } catch (error) {
                setLoading(false)
                console.log(error);
                toast.error('Erro ao consultar dados');
            }
        }
        obterDados();

    }, [id, auth.id]);

    async function removeClub(data: IClube) {
        const confirmar = confirm('Deseja remover ' + data.nome + ' da lista?')

        if (confirmar) {
            try {
                const clubesEstatisticas = await getCampeonatoEstatisticas(campeonato.id)
                if (clubesEstatisticas instanceof Error) {
                    return;
                } else {
                    const clubeTabelaInfo: IClubeCampeonato[] = clubesEstatisticas.filter((clubesEstatistica: IClubeCampeonato) => clubesEstatistica.clubeId === data.id)

                    const delTabelaInfoRes = await deletarCampeonatoClubeEstatisticas(clubeTabelaInfo[0].id)

                    if (delTabelaInfoRes instanceof Error) {
                        return;
                    } else {
                        const jogadoresClubRes = await obterJogadoresDoClubePorId(data.id)

                        if (jogadoresClubRes instanceof Error) {
                            return;
                        } else {
                            await Promise.all(
                                jogadoresClubRes.map((jogador: IJogador) => Api.delete(`/jogadores/${jogador.id}`))
                            );
                        }

                        const response = await deletarClubePorId(data.id)

                        if (response instanceof Error) {
                            return;
                        } else {
                            const i = arrClubs.indexOf(data)
                            arrClubs.splice(i, 1)
                            setArrClubs([...arrClubs]);
                            setClubeSelecionado(arrClubs[0])
                            getClubPlayers(arrClubs[0])
                        }

                    }
                }


            } catch (error) {
                console.log(error)
                toast.error("Erro ao deletar clube")
            }
        }
    }

    async function handleAddClub(data: Omit<IClube, 'id'>) {
        try {
            const response = await criarClube(data)

            if (typeof response === 'number') {
                const novoClube: IClube = {
                    ...data,
                    id: response
                }

                setArrClubs([...arrClubs, novoClube])

                const infoClubeTabela: Omit<IClubeCampeonato, 'id'> = {
                    campeonatoId: campeonato.id,
                    clubeId: novoClube.id,
                    cartoesAmarelos: 0,
                    cartoesVermelhos: 0,
                    derrotas: 0,
                    empates: 0,
                    golsContra: 0,
                    golsPro: 0,
                    vitorias: 0
                }

                await criarClubeCampeonatoEstatisticas(infoClubeTabela)
            }

        } catch (error) {
            console.log(error)
            toast.error("Erro ao criar clube")
        }
    }

    async function handleUpdateClub(data: Omit<IClube, 'id'>) {
        try {
            const response = await Api.put(`/clubes/${clubeSelecionado?.id}`, data);

            if (response.status === 204) {
                toast.success("Clube atualizado")

                if (clubeSelecionado) {
                    const novosDados = {
                        id: clubeSelecionado.id,
                        ...data
                    }

                    const i = arrClubs.indexOf(clubeSelecionado)
                    arrClubs.splice(i, 1)
                    setArrClubs([novosDados, ...arrClubs])
                }

            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao atualizar clube")
        }
    }

    async function handleAddPlayer(data: Omit<IJogador, 'id'>) {
        try {
            const dados = {
                nome: data.nome,
                dataNascimento: formatToDate(data.dataNascimento),
                posicaoId: data.posicaoId,
                nacionalidade: data.nacionalidade,
                numeroCamisa: data.numeroCamisa,
                clubeId: data.clubeId
            }

            const response = await criarJogador(dados)

            if (typeof response === 'number') {
                const novoJogador = {
                    ...dados,
                    id: response
                }

                setJogadores([...jogadores, novoJogador])
            }

        } catch (error) {
            console.log(error)
            toast.error("Erro ao adicionar jogador")
        }
    }

    function openModal(id: number) {
        setClubeId(id)
        setModalPlayer(true)
    }

    function openUpdatePlayerModal(jogador: IJogador) {
        setSelectedPlayer(jogador)
        setModalUpdatePlayer(true)
    }

    function openUpdateClubModal(clube: IClube) {
        setClubeSelecionado(clube)
        setModalUpdateCLub(true)
    }

    async function getClubPlayers(club: IClube) {
        setClubeSelecionado(club)
        setLoading(true)

        try {
            const response = await obterJogadoresDoClubePorId(club.id)

            if (response instanceof Error) {
                return;
            } else {
                setJogadores(response)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function deletePlayer(jogador: IJogador) {
        const confirmar = confirm(`Deseja deletar o jogador ${jogador.nome}?`)

        if (confirmar) {
            try {
                const response = await deletarJogadorPorId(jogador.id)

                if (response === undefined || response === null) {
                    const index = jogadores.indexOf(jogador);
                    jogadores.splice(index, 1);
                    setJogadores([...jogadores]);
                }

            } catch (error) {
                console.log(error)
            }
        }
    }

    async function updadePlayer(novosDados: Omit<IJogador, 'id' | 'clubeId'>) {
        const dados = {
            nome: novosDados.nome,
            dataNascimento: formatToDate(novosDados.dataNascimento),
            posicaoId: novosDados.posicaoId,
            nacionalidade: novosDados.nacionalidade,
            numeroCamisa: novosDados.numeroCamisa
        }
        try {
            if (selectedPlayer) {
                const response = await atualizarJogadorPorId(selectedPlayer?.id, dados)
                if (response instanceof Error) {
                    return;
                } else {
                    const i = jogadores.indexOf(selectedPlayer)
                    jogadores.splice(i, 1)

                    const jogadorAtualizado = {
                        ...dados,
                        id: selectedPlayer.id,
                        clubeId: selectedPlayer.clubeId
                    }
                    setJogadores([...jogadores, jogadorAtualizado])

                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {loading && <Loading />}
            {modalUpdatePlayer && <UpdatePlayer player={selectedPlayer} handleUpdatePlayer={updadePlayer} fecharModal={() => setModalUpdatePlayer(false)} />}
            {modalPlayer && <AddPlayer clubeId={clubeId} handleAddPlayer={handleAddPlayer} fecharModal={() => setModalPlayer(false)} />}
            {modal && <AddClub handleAddClube={handleAddClub} fecharModal={() => setModal(false)} />}
            {modalUpdateClub && <UpdateClub handleUpdateClube={handleUpdateClub} club={clubeSelecionado} fecharModal={() => setModalUpdateCLub(false)} />}
            <main className={styles.gerenciarClubeContainer}>
                <section>
                    <div className={styles.addClubContainer}>
                        <div className={styles.clubsBox}>
                            <h2>Clubes</h2>
                            {arrClubs.length < campeonato.quantidadeTimes && (
                                <button onClick={() => setModal(true)}>ADICIONAR CLUBE</button>
                            )}
                            {arrClubs.map((club) => (
                                <div key={club.id} className={`${styles.club} ${clubeSelecionado?.nome === club.nome ? styles.clubeSelecionado : ''}`} onClick={() => getClubPlayers(club)}>
                                    <div className={styles.clubInfo}>
                                        <div>
                                            <div className={styles.escudo}>
                                                <div style={{ backgroundColor: `${club.cor_principal}`, width: '50px', height: '50px' }}></div>
                                                <div style={{ backgroundColor: `${club.cor_secundaria}`, width: '50px', height: '20px', position: 'absolute', top: '15px' }}></div>
                                            </div>
                                            <h4>{club.nome.toUpperCase()} </h4>
                                        </div>
                                        <p>Mascote: {club.mascote}</p>
                                    </div>
                                    <div className={styles.clubSettings}>
                                        <FontAwesomeIcon className={styles.editIcon} icon={faEdit} onClick={() => openUpdateClubModal(club)} />
                                        <FontAwesomeIcon className={styles.trashIcon} icon={faTrash} onClick={() => removeClub(club)} />
                                        <FontAwesomeIcon className={styles.editIcon} icon={faUserPlus} onClick={() => openModal(club.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.jogadoresContainer}>
                            <h2>Jogadores</h2>
                            <table border={1}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nome</th>
                                        {/* <th>Data de Nascimento</th> */}
                                        <th>Nacionalidade</th>
                                        <th>Número da Camisa</th>
                                        <th>Posição</th>
                                        <th>Idade</th>
                                        <th>Excluir</th>
                                        <th>Editar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jogadores.map((jogador, index) => (
                                        <tr key={jogador.id}>
                                            <td>{index + 1}º </td>
                                            <td>{jogador.nome}</td>
                                            {/* <td>{jogador.dataNascimento.toString()}</td> */}
                                            <td>{jogador.nacionalidade}</td>
                                            <td>{jogador.numeroCamisa}</td>
                                            <td>
                                                {posicoes.find(posicao => posicao.id === jogador.posicaoId)?.nome}
                                            </td>
                                            <td>{calcularIdade(jogador.dataNascimento)}</td>
                                            <td><FontAwesomeIcon icon={faTrash} onClick={() => deletePlayer(jogador)} /></td>
                                            <td><FontAwesomeIcon icon={faUserEdit} onClick={() => openUpdatePlayerModal(jogador)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default GerenciarClubes;
