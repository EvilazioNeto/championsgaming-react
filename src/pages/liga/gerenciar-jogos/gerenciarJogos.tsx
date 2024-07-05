import { useParams } from 'react-router-dom';
import styles from './gerenciarJogos.module.css';
import { useEffect, useState } from 'react';
import { Api } from '../../../services/api/axios-config';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { IJogo } from '../../../interfaces/Jogos';
import { IClube } from '../../../interfaces/Clube';
import { IClubeCampeonato } from '../../../interfaces/ClubeCampeonato';
import { getCampeonatoEstatisticas } from '../../../services/api/club/clubService';

function GerenciarJogos() {
    const { id } = useParams();
    const [jogos, setJogos] = useState<IJogo[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>();
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);

    useEffect(() => {
        async function obterDados() {
            const response = await Api.get(`/campeonatos/${id}`)

            if (response.status === 200 && id) {
                setCampeonato(response.data)
                const idToNumber =  parseInt(id)

                const infoTabela = await getCampeonatoEstatisticas(idToNumber);

                if(infoTabela instanceof Error){
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
                console.log(clubes)
                setArrClubs(clubes);

            }
        }
        obterDados()
    }, [id])

    return (
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
                <div>
                    clube 1
                    <select name="" id="">
                        {arrClubs.map((clube) => (
                            <option value="">{clube.nome}</option>
                        ))}
                    </select>
                </div>
            </section>
        </main >
    )
}

export default GerenciarJogos;
