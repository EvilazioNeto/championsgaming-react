import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { Api } from "../../../services/api/axios-config";
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from "../../../components/ui/table";
import styles from './tabela.module.css';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { ICampeonato } from "../../../interfaces/Campeonato";

interface ITabelaProps extends IClubeCampeonato {
    pontos: number,
    nomeClube: string;
    fotoUrl: string;
}

function Tabela() {
    const { id } = useParams();
    const [clubsStats, setClubStats] = useState<ITabelaProps[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato);

    useEffect(() => {
        async function getData() {
            try {
                if (id) {
                    const campeonatoRes = await Api.get(`/campeonatos/${id}`)

                    if (campeonatoRes.status === 200) {
                        setCampeonato(campeonatoRes.data);
                    }
                    const response = await getCampeonatoEstatisticas(Number(id));

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
                                fotoUrl: clube ? clube.data.fotoUrl : 'foto não encontrada',
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
            <section className="m-auto w-full max-w-screen-xl flex flex-col gap-4">
                <Breadcrumb className='pb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>
                                        <Link to="/minhas-ligas">Minhas Ligas</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {campeonato.nome}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Tabela</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-2xl">TABELA DO CAMPEONATO</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Clube</TableHead>
                            <TableHead>Pts</TableHead>
                            <TableHead>PJ</TableHead>
                            <TableHead >VIT</TableHead>
                            <TableHead >EMP</TableHead>
                            <TableHead>DER</TableHead>
                            <TableHead className="max-sm:hidden">GM</TableHead>
                            <TableHead className="max-sm:hidden">GC</TableHead>
                            <TableHead>SG</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clubsStats.map((clubStats) => (
                            <TableRow key={clubStats.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <img
                                        alt="club image"
                                        className="aspect-square rounded-md object-cover"
                                        height="40"
                                        src={clubStats.fotoUrl}
                                        width="40"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {clubStats.nomeClube}
                                </TableCell>
                                <TableCell>
                                    {(clubStats.vitorias * 3) + (clubStats.empates)}
                                </TableCell>
                                <TableCell>
                                    {clubStats.vitorias + clubStats.empates + clubStats.derrotas}
                                </TableCell>
                                <TableCell>
                                    {clubStats.vitorias}
                                </TableCell>
                                <TableCell>
                                    {clubStats.empates}
                                </TableCell>
                                <TableCell>
                                    {clubStats.derrotas}
                                </TableCell>
                                <TableCell className="max-sm:hidden">
                                    {clubStats.golsPro}
                                </TableCell>
                                <TableCell className="max-sm:hidden">
                                    {clubStats.golsContra}
                                </TableCell>
                                <TableCell>
                                    {clubStats.golsPro - clubStats.golsContra}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}

export default Tabela;
