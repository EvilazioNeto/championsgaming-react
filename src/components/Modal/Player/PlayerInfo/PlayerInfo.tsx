"use client"

import {
    Card,
    CardContent,
} from "../../../ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../../../ui/chart"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { useEffect } from "react";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "../../../ui/hover-card";
import assistenciaLogo from "/assistencia.png";

interface IjogadorStatsProps {
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    gols: number;
    jogadorId: number;
    nome: string;
    fotoUrl: string;
}

interface PlayerInfoProps {
    jogador: IjogadorStatsProps
}


function PlayerInfo({ jogador }: PlayerInfoProps) {
    const chartData = [
        { stats: "Gols", numberStats: jogador.gols, fill: "var(--color-gols)" },
        { stats: "Assistências", numberStats: jogador.assistencias, fill: "var(--color-assistencias)" },
        { stats: "Cartões Amarelos", numberStats: jogador.cartoesAmarelos, fill: "var(--color-cartoesAmarelos)" },
        { stats: "Cartões Vermelhos", numberStats: jogador.cartoesVermelhos, fill: "var(--color-cartoesVermelhos)" },
    ]
    const totalnumberStats = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.numberStats, 0)
    }, [])

    const chartConfig = {
        numberStats: {
            label: "numberStats",
        },
        gols: {
            label: "Gols",
            color: "hsl(var(--chart-1))",
        },
        assistencias: {
            label: "assistencias",
            color: "hsl(var(--chart-2))",
        },
        cartoesAmarelos: {
            label: "cartoesAmarelos",
            color: "hsl(var(--chart-3))",
        },
        cartoesVermelhos: {
            label: "cartoesVermelhos",
            color: "hsl(var(--chart-4))",
        },
    } satisfies ChartConfig;

    useEffect(() => {
        console.log(jogador)
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>Detalhes</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Estatísticas do jogador</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4">
                    <img className="aspect-square rounded-md object-cover w-[170px] h-[170px]" src={jogador.fotoUrl} alt="" />
                    <div className="w-full flex flex-col gap-2">
                        <h2 className="text-2xl text-center">{jogador.nome}</h2>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex justify-around">
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[20px] rounded" src="https://imagepng.org/bola/bola-6/" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Gols</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.gols}</p>
                                </div>
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[20px] rounded" src={assistenciaLogo} alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Assistências</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.assistencias}</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-around">
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[20px] rounded" src="https://img2.gratispng.com/20180325/vdw/kisspng-penalty-card-yellow-card-association-football-refe-sim-cards-5ab74207cf9f95.5798399315219594318504.jpg" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Cartões Amarelos</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.cartoesAmarelos}</p>
                                </div>
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[20px] rounded" src="https://m.media-amazon.com/images/I/51hvmeVHvgL._AC_UF894,1000_QL80_.jpg" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Cartões Vermelhos</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.cartoesVermelhos}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Card className="flex flex-col">
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="numberStats"
                                    nameKey="stats"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalnumberStats.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Participações
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default PlayerInfo;