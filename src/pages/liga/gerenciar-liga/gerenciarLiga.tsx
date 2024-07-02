import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../../../services/api/axios-config";
import { toast } from "react-toastify";
import styles from './gerenciarLiga.module.css';
import { ICampeonato } from "../../../interfaces/Campeonato";
// import { IClube } from "../../../interfaces/Clube";
import { useAuth } from "../../../contexts/AuthProvider/useAuth";
// import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faPlay, faShieldHalved, faTable } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function GerenciarLiga() {
    const [btnSelected, setBtnSelected] = useState<string>('clubes');
    const { id } = useParams();
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato)
    // const [arrClubs, setArrClubs] = useState<IClube[]>([]);

    const auth = useAuth();

    useEffect(() => {
        async function obterDados() {
            try {
                const response = await Api.get(`/campeonatos/${id}`)

                if (response.status === 200) {
                    setCampeonato(response.data);

                    // const infoTabela = await Api.get(`/campeonatos/${response.data.id}/clubes`);
                    // const promessas = infoTabela.data.map((info: IClubeCampeonato) => {
                    //     return Api.get(`/clubes/${info.clubeId}`);
                    // });

                    // const responses = await Promise.all(promessas);

                    // let clubes: IClube[] = [];
                    // responses.forEach((res) => {
                    //     if (res.status === 200) {
                    //         clubes = [...clubes, res.data];
                    //     }
                    // });

                    // setArrClubs(clubes);
                }
            } catch (error) {
                console.log(error);
                toast.error('Erro ao consultar dados');
            }
        }
        obterDados();

    }, [id, auth.id]);


    return (
        <>

            <main className={styles.gerenciarLigaContainer}>
                <section>
                    <h1>{campeonato?.nome}</h1>
                    <ul>
                        <li className={btnSelected === 'clubes' ? styles.selected : ''} onClick={() => setBtnSelected('clubes')}>
                            <Link to={`/minhas-ligas/${id}/clubes`}>
                                CLUBES
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </Link>
                        </li>
                        <li className={btnSelected === 'tabela' ? styles.selected : ''} onClick={() => setBtnSelected('tabela')}>
                            <Link to={`/minhas-ligas/${id}/tabela`}>
                                TABELA
                                <FontAwesomeIcon icon={faTable} />
                            </Link>
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


                </section>
            </main>

        </>
    )
}

export default GerenciarLiga;
