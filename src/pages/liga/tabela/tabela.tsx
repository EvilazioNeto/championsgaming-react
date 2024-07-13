import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { Api } from "../../../services/api/axios-config";
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "../../../components/ui/table";
import styles from './tabela.module.css';

interface ITabelaProps extends IClubeCampeonato {
    pontos: number,
    nomeClube: string;
}

function Tabela() {
    const { id } = useParams();
    const [clubsStas, setClubStats] = useState<ITabelaProps[]>([]);

    useEffect(() => {
        async function getData() {
            try {
                if (id) {
                    const idToNumber = parseInt(id);
                    const response = await getCampeonatoEstatisticas(idToNumber);

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
                            };
                        }).sort((a, b) => {
                            if (b.pontos !== a.pontos) {
                                return b.pontos - a.pontos;
                            } else {
                                return b.golsPro - a.golsPro;
                            }
                        });

                        setClubStats(tabelaAtt);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [id]);

    return (
        <main className={styles.tabelaCampeonatoContainer}>
            <section>
                <Table>
                    <TableHeader className="flex flex-col items-center">
                        <TableHead className="w-full">
                            <TableRow>
                                <TableCell>Clube</TableCell>
                                <TableCell align="center">Pts</TableCell>
                                <TableCell align="center">PJ</TableCell>
                                <TableCell align="center">VIT</TableCell>
                                <TableCell align="center">E</TableCell>
                                <TableCell align="center">DER</TableCell>
                                <TableCell align="center">GM</TableCell>
                                <TableCell align="center">GC</TableCell>
                                <TableCell align="center">SG</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="w-full">
                            {clubsStas.map((clube) => (
                                <TableRow key={clube.id} >
                                    <TableCell>{clube.nomeClube}</TableCell>
                                    <TableCell align="center">{(clube.vitorias * 3) + (clube.empates)}</TableCell>
                                    <TableCell align="center">{clube.vitorias + clube.empates + clube.derrotas}</TableCell>
                                    <TableCell align="center">{clube.vitorias}</TableCell>
                                    <TableCell align="center">{clube.empates}</TableCell>
                                    <TableCell align="center">{clube.derrotas}</TableCell>
                                    <TableCell align="center">{clube.golsPro}</TableCell>
                                    <TableCell align="center">{clube.golsContra}</TableCell>
                                    <TableCell align="center">{clube.golsPro - clube.golsContra}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableHeader>
                </Table>
            </section>
        </main>
    );
}

export default Tabela;
