import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../../../services/api/axios-config";
import { toast } from "react-toastify";
import styles from './gerenciarLiga.module.css';
import { ICampeonato } from "../../../interfaces/Campeonato";
import { IClube } from "../../../interfaces/Clube";
import AddClub from "../../../components/Modal/AddClub/AddClub";
import { useAuth } from "../../../contexts/AuthProvider/useAuth";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFutbol, faPlay, faShieldHalved, faTable, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function GerenciarLiga() {
    const [btnSelected, setBtnSelected] = useState<string>('clubes');
    const { id } = useParams();
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato)
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const auth = useAuth();

    useEffect(() => {
        async function obterDados() {
            try {
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
                }
            } catch (error) {
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
                const tabelas = await Api.get(`/campeonatos/${campeonato.id}/clubes`);
                const clubeTabelaInfo: IClubeCampeonato[] = tabelas.data.filter((tabela: IClubeCampeonato) => tabela.clubeId === data.id)

                const delTabelaInfoRes = await Api.delete(`/clubes-campeonatos/${clubeTabelaInfo[0].id}`)
                toast.success("Clube excluido da tabela")

                if (delTabelaInfoRes.status === 200) {
                    const response = await Api.delete(`/clubes/${data.id}`);

                    if (response.status === 204) {
                        const i = arrClubs.indexOf(data)
                        arrClubs.splice(i, 1)
                        setArrClubs([...arrClubs]);
                        toast.success("Clube deletado com sucesso")
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
            const response = await Api.post("/clubes", data);

            const novoClube: IClube = {
                ...data,
                id: response.data
            }

            if (response.status === 201) {
                setArrClubs([...arrClubs, novoClube])
                toast.success("Clube criado com sucesso")
            }

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

            const response2 = await Api.post(`/clubes-campeonatos`, infoClubeTabela);

            if (response2.status === 201) {
                toast.success("Adicionado na liga: " + `${campeonato.nome}`)
            }


        } catch (error) {
            console.log(error)
            toast.error("Erro ao criar clube")
        }
    }

    return (
        <>
            {modal && <AddClub handleAddClube={handleAddClub} fecharModal={() => setModal(false)} />}
            {arrClubs ? (
                <main className={styles.gerenciarLigaContainer}>
                    <section>
                        <h1>{campeonato?.nome}</h1>
                        <ul>
                            <li className={btnSelected === 'clubes' ? styles.selected : ''} onClick={() => setBtnSelected('clubes')}>
                                CLUBES
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </li>
                            <li className={btnSelected === 'tabela' ? styles.selected : ''} onClick={() => setBtnSelected('tabela')}>
                                TABELA
                                <FontAwesomeIcon icon={faTable} />
                            </li>
                            <li className={btnSelected === 'jogos' ? styles.selected : ''} onClick={() => setBtnSelected('jogos')}>
                                JOGOS
                                <FontAwesomeIcon icon={faPlay} />
                            </li>
                            <li className={btnSelected === 'artilheiros' ? styles.selected : ''} onClick={() => setBtnSelected('artilheiros')}>
                                ARTILHEIROS
                                <FontAwesomeIcon icon={faFutbol} />
                            </li>
                        </ul>

                        <div className={styles.addClubContainer}>
                            <div className={styles.clubsBox}>
                                <h2>Clubes</h2>
                                {arrClubs.length < campeonato.quantidadeTimes && (
                                    <button onClick={() => setModal(true)}>ADICIONAR CLUBE</button>
                                )}
                                {arrClubs.map((club) => (
                                    <div key={club.id} className={styles.club}>
                                        <div className={styles.clubInfo}>
                                            <div>
                                                <div className={styles.escudo}>
                                                    <div style={{ backgroundColor: `${club.cor_principal}`, width: '50px', height: '50px' }}></div>
                                                    <div style={{ backgroundColor: `${club.cor_secundaria}`, width: '50px', height: '20px', position: 'absolute', top: '15px' }}></div>
                                                </div>
                                                <h4>{club.nome.toUpperCase()} </h4>
                                            </div>
                                            <p>26 Jogadores</p>
                                            <p>Mascote: {club.mascote}</p>
                                        </div>
                                        <div className={styles.clubSettings}>
                                            <FontAwesomeIcon className={styles.editIcon} icon={faEdit} />
                                            <FontAwesomeIcon className={styles.trashIcon} icon={faTrash} onClick={() => removeClub(club)} />
                                            <FontAwesomeIcon className={styles.editIcon} icon={faUserPlus} />
                                            {/* <FontAwesomeIcon className={styles.tableIcon} icon={faTable} /> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.jogadoresContainer}>

                            </div>
                        </div>
                    </section>
                </main>
            ) : (
                <h2 style={{ textAlign: 'center', marginTop: '400px' }}>Loading...</h2>
            )}
        </>
    )
}

export default GerenciarLiga;
