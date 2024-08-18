"use client"

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api } from "../../../services/api/axios-config";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { IClube } from "../../../interfaces/Clube";
import { IJogadorJogo } from "../../../interfaces/JogadorJogo";
import { IJogador } from "../../../interfaces/Jogador";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { ICampeonato } from "../../../interfaces/Campeonato";

interface IjogadorStatsProps {
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    gols: number;
    jogadorId: number;
    nome: string;
}

function Estatisticas() {
    const { id } = useParams();
    const [jogadoresStats, setJogadoresStats] = useState<IjogadorStatsProps[]>([]);
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato);

    useEffect(() => {
        async function obterDados() {
            try {
                const campeonatoRes = await Api.get(`/campeonatos/${id}`)

                if (campeonatoRes.status === 200) {
                    setCampeonato(campeonatoRes.data);
                }

                const response = await Api.get(`/campeonatos/${id}`);

                if (response.status === 200 && id) {
                    const infoTabela = await getCampeonatoEstatisticas(Number(id));

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

                    const jogadoresPromessas = clubes.map((clube: IClube) => {
                        return Api.get(`/clubes/${clube.id}/jogadores`);
                    });

                    const jogadoresRes = await Promise.all(jogadoresPromessas);

                    let jogadores: IJogador[] = [];
                    jogadoresRes.forEach((res) => {
                        if (res.status === 200) {
                            jogadores = [...jogadores, ...res.data];
                        }
                    });

                    const jogadoresStatsPromessas = jogadores.map((jogador: IJogador) => {
                        return Api.get(`/jogadores/${jogador.id}/jogos`);
                    });

                    const jogadorStatsRes = await Promise.all(jogadoresStatsPromessas);
                    let jogadoresStats: IJogadorJogo[] = [];
                    jogadorStatsRes.forEach((res) => {
                        if (res.status === 200) {
                            if (res.data.length > 0) {
                                jogadoresStats = [...jogadoresStats, ...res.data];
                            }
                        }
                    });

                    const jogadoresGols: { [key: number]: { gols: number, assistencias: number, nome: string, fotoUrl: string, cartoesAmarelos: number, cartoesVermelhos: number } } = {};
                    jogadoresStats.forEach((jogadorStats) => {
                        if (!jogadoresGols[jogadorStats.jogadorId]) {
                            jogadoresGols[jogadorStats.jogadorId] = { gols: 0, assistencias: 0, nome: '', fotoUrl: '', cartoesAmarelos: 0, cartoesVermelhos: 0 };
                        }
                        jogadoresGols[jogadorStats.jogadorId].gols += jogadorStats.gols;
                        jogadoresGols[jogadorStats.jogadorId].assistencias += jogadorStats.assistencias;
                        jogadoresGols[jogadorStats.jogadorId].cartoesAmarelos += jogadorStats.cartaoAmarelo;
                        jogadoresGols[jogadorStats.jogadorId].cartoesVermelhos += jogadorStats.cartaoVermelho;
                        jogadores.map((jogador) => {
                            if (jogador.id === jogadorStats.jogadorId) {
                                jogadoresGols[jogadorStats.jogadorId].nome = jogador.nome
                                jogadoresGols[jogadorStats.jogadorId].fotoUrl = jogador.fotoUrl
                            }
                        })
                    });

                    const jogadoresGolsArray = Object.keys(jogadoresGols).map((jogadorId) => ({
                        jogadorId: Number(jogadorId),
                        ...jogadoresGols[Number(jogadorId)]
                    }));

                    setJogadoresStats(jogadoresGolsArray.sort((a, b) => {
                        if (b.gols !== a.gols) {
                            return b.gols - a.gols;
                        } else {
                            return a.nome.localeCompare(b.nome);
                        }
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
        obterDados();
    }, [id]);

    const chartGols = jogadoresStats.filter(jogadorStats => jogadorStats.gols > 0)
        .map(jogadorStats => ({
            jogador: jogadorStats.nome,
            gols: jogadorStats.gols
        }));

    const chartAssistencias = jogadoresStats.filter(jogadorStats => jogadorStats.assistencias > 0)
        .map(jogadorStats => ({
            jogador: jogadorStats.nome,
            assistencias: jogadorStats.assistencias
        }));

    const chartConfig = {
        gols: {
            label: "Gols",
            color: "hsl(var(--chart-1))",
        },
        assistencias: {
            label: "Assistências",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "#fff",
        },
    } satisfies ChartConfig

    useEffect(() => {
        console.log(jogadoresStats)
    }, [jogadoresStats])

    return (
        <main>
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
                            <BreadcrumbPage>Estatísticas</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-2xl">Estatísticas do Campeonato</h1>

                <div className="flex flex-col gap-4 xl:flex-row">
                    <Card className="w-full xl:w-1/2">
                        <CardHeader>
                            <CardTitle>Artilheiros</CardTitle>
                            {/* <CardDescription>2024</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="min-h-[200px] max-h-[400px] w-full" config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartGols}
                                    layout="vertical"
                                    margin={{
                                        right: 16,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                        dataKey="jogador"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <XAxis dataKey="gols" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Bar
                                        dataKey="gols"
                                        layout="vertical"
                                        fill="var(--color-gols)"
                                        radius={4}
                                    >
                                        <LabelList
                                            dataKey="jogador"
                                            position="insideLeft"
                                            offset={8}
                                            className="fill-[--color-label]"
                                            fontSize={14}
                                        />
                                        <LabelList
                                            dataKey="gols"
                                            position="right"
                                            offset={8}
                                            className="fill-foreground"
                                            fontSize={14}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="w-full xl:w-1/2">
                        <CardHeader>
                            <CardTitle>Assistências</CardTitle>
                            {/* <CardDescription>2024</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="min-h-[200px] max-h-[400px] w-full" config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartAssistencias}
                                    layout="vertical"
                                    margin={{
                                        right: 16,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                        dataKey="jogador"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <XAxis dataKey="assistencias" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Bar
                                        dataKey="assistencias"
                                        layout="vertical"
                                        fill="var(--color-gols)"
                                        radius={4}
                                    >
                                        <LabelList
                                            dataKey="jogador"
                                            position="insideLeft"
                                            offset={8}
                                            className="fill-[--color-label]"
                                            fontSize={14}
                                        />
                                        <LabelList
                                            dataKey="assistencias"
                                            position="right"
                                            offset={8}
                                            className="fill-foreground"
                                            fontSize={14}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}

export default Estatisticas;
