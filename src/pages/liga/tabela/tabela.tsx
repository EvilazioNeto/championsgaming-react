import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import styles from './tabela.module.css';
import { Api } from "../../../services/api/axios-config";

interface ITabelaProps extends IClubeCampeonato {
    pontos: number,
    nomeClube: string;
}

function Tabela() {
    const { id } = useParams()
    const [clubsStas, setClubStats] = useState<ITabelaProps[]>([]);

    useEffect(() => {
        async function getData() {
            try {
                if (id) {
                    const idToNumber = parseInt(id)
                    const response = await getCampeonatoEstatisticas(idToNumber)

                    if (response instanceof Error) {
                        return;
                    } else {
                        const promessas = response.map((info: IClubeCampeonato) => {
                            return Api.get(`/clubes/${info.clubeId}`);
                        });

                        const clubes = await Promise.all(promessas);

                        const tabelaAtt = response.map((data) => {
                            const clube = clubes.find(clube => clube.data.id === data.clubeId);

                            return {
                                ...data,
                                nomeClube: clube ? clube.data.nome : 'Nome não encontrado',
                                pontos: (data.vitorias * 3) + (data.empates)
                            }
                        }).sort((a, b) => {
                            if (b.pontos !== a.pontos) {
                                return b.pontos - a.pontos;
                            } else {
                                return b.golsPro - a.golsPro;
                            }
                        });

                        setClubStats(tabelaAtt)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [id])

    return (
        <main className={styles.tabelaCampeonatoContainer}>
            <section>
                <h1>TABELA DO CAMPEONATO</h1>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Clube</th>
                            <th>PJ</th>
                            <th>VIT</th>
                            <th>E</th>
                            <th>DER</th>
                            <th>GM</th>
                            <th>GC</th>
                            <th>SG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubsStas.map((clube) => (
                            <tr key={clube.id}>
                                <td>{clube.nomeClube}</td>
                                <td>{clube.vitorias + clube.empates + clube.derrotas}</td>
                                <td>{clube.vitorias}</td>
                                <td>{clube.empates}</td>
                                <td>{clube.derrotas}</td>
                                <td>{clube.golsPro}</td>
                                <td>{clube.golsContra}</td>
                                <td>{clube.golsPro - clube.golsContra}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    )
}

export default Tabela;
