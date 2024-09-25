"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../../components/ui/chart"

export const description = "A mixed bar chart"

const chartData = [
    { clube: "Brasileirão", Visitantes: 275, fill: "var(--color-Brasileirão)" },
    { clube: "PremierLeague", Visitantes: 200, fill: "var(--color-PremierLeague)" },
    { clube: "Bundesliga", Visitantes: 187, fill: "var(--color-Bundesliga)" },
    { clube: "Laliga", Visitantes: 173, fill: "var(--color-Laliga)" },
    { clube: "outro", Visitantes: 90, fill: "var(--color-outro)" },
]

const chartConfig = {
    Visitantes: {
        label: "Visitantes",
    },
    Brasileirão: {
        label: "Brasileirão",
        color: "hsl(var(--chart-1))",
    },
    PremierLeague: {
        label: "Premier League",
        color: "hsl(var(--chart-2))",
    },
    Bundesliga: {
        label: "Bundesliga",
        color: "hsl(var(--chart-3))",
    },
    Laliga: {
        label: "La liga",
        color: "hsl(var(--chart-4))",
    },
    outro: {
        label: "outro",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

import { Activity, Shield, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider/useAuth";
import { useEffect, useState } from "react";
import { Api } from "../../services/api/axios-config";
import { IClube } from "../../interfaces/Clube";
import { ICampeonato } from "../../interfaces/Campeonato";
import { IJogador } from "../../interfaces/Jogador"
import { IJogo } from "../../interfaces/Jogos"

function Home() {
    const { id } = useAuth();
    const [clubes, setClubes] = useState<IClube[]>([]);
    const [Campeonatos, setCampeonatos] = useState<ICampeonato[]>([]);
    const [Jogadores, setJogadores] = useState<IJogador[]>([]);
    const [jogos, setJogos] = useState<IJogo[]>([]);

    useEffect(() => {
        async function obterDados() {

            const clubeRes = await Api.get(`/usuario/${Number(id)}/clubes`);

            if (clubeRes.status === 200) {
                setClubes(clubeRes.data);
            }

            const campeonatoRes = await Api.get(`/usuario/${Number(id)}/campeonatos`);

            if (campeonatoRes.status === 200) {
                setCampeonatos(campeonatoRes.data);
            }

            let JogadoresArr: IJogador[] = [];
            let jogosArr: IJogo[] = [];

            Promise.all(
                clubeRes.data.map(async (clube: IJogador) => {
                    const response = await Api.get(`/clubes/${clube.id}/jogadores`);
                    JogadoresArr = [...JogadoresArr, ...response.data];
                })
            )
                .then(() => {
                    setJogadores(JogadoresArr);
                })
                .catch((error) => {
                    console.error("Erro ao buscar jogadores:", error);
                });

                Promise.all(
                    campeonatoRes.data.map(async (campeonato: ICampeonato) => {
                        const response = await Api.get(`/campeonatos/${campeonato.id}/jogos`);
                        jogosArr = [...jogosArr, ...response.data];
                    })
                )
                    .then(() => {
                        setJogos(jogosArr);
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar jogos:", error);
                    });
        }
        obterDados();
    }, [])

    return (
        <main className="">
            <section className="m-auto w-full max-w-screen-xl flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card x-chunk="dashboard-01-chunk-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de clubes
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clubes.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +20,1% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Campeonatos
                            </CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Campeonatos.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +180.1% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jogadores</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Jogadores.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +19% em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jogos</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{jogos.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +2 em relação ao mês passado
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex max-[1150px]:flex-col gap-4 justify-between items-start">
                    <Card className="flex-1 max-[1150px]:w-full">
                        <CardHeader>
                            <CardTitle>Campeonatos mais visitados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="max-h-[300px] w-full" config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    layout="vertical"
                                    margin={{
                                        left: 0,
                                    }}
                                >
                                    <YAxis
                                        dataKey="clube"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={0}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            chartConfig[value as keyof typeof chartConfig]?.label
                                        }
                                    />
                                    <XAxis dataKey="Visitantes" type="number" hide />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="Visitantes" layout="vertical" radius={5} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <div className="relative">
                        <img className="bg-red-50 top-[60%] rounded-lg right-0 absolute w-[80px]" src="/spoilergif.gif" alt="" />
                        <img className="max-[1150px]:w-full rounded-lg w-[380px]" src="/newsports-banner.png" alt="" />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home;
