import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ICampeonato } from "../../../interfaces/Campeonato";
import { Input } from "../../../components/ui/input";
import { obterCampeonatoPorId } from "../../../services/league/campeonatoService";
import { Card } from "../../../components/ui/card";
import formatarDataString from "../../../utils/formatarDataString";
import { Button } from "../../../components/ui/button";
import { Bell, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { getCampeonatoEstatisticas } from "../../../services/club/clubService";
import { Api } from "../../../services/api/axios-config";
import { toast } from "react-toastify";
import { IJogo } from "../../../interfaces/Jogos";
import { IClube } from "../../../interfaces/Clube";
import { IJogador } from "../../../interfaces/Jogador";
import { IJogadorJogo } from "../../../interfaces/JogadorJogo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import PlayerInfo from "../../../components/Modal/Player/PlayerInfo/PlayerInfo";

interface ITabelaProps extends IClubeCampeonato {
    pontos: number;
    nomeClube: string;
    fotoUrl: string;
}

interface IjogadorStatsProps {
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    gols: number;
    jogadorId: number;
    nome: string;
    fotoUrl: string;
}


function ViewStats() {
    const { id } = useParams();
    const [campeonato, setCampeonato] = useState<ICampeonato | null>(null);
    const [clubsStats, setClubStats] = useState<ITabelaProps[]>([]);
    const [rodada, setRodada] = useState<number>(1);
    const [jogos, setJogos] = useState<IJogo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(0);
    const [campId, setCampId] = useState<string>('');
    const [jogadoresStats, setJogadoresStats] = useState<IjogadorStatsProps[]>([]);
    const [jogadoresAssists, setJogadoresAssists] = useState<IjogadorStatsProps[]>([]);


    useEffect(() => {
        if (campeonato) {
            const totalJogos = (campeonato.quantidadeTimes * (campeonato.quantidadeTimes - 1)) / 2;
            const jogosPorRodada = totalJogos / campeonato.numeroRodadas;
            setPerPage(jogosPorRodada);
        }
    }, [campeonato]);

    useEffect(() => {
        async function obterDados() {
            try {
                const campeonatoRes = await obterCampeonatoPorId(Number(id));
                if (campeonatoRes instanceof Error) return;
                setCampeonato(campeonatoRes);

                const response = await getCampeonatoEstatisticas(Number(id));
                if (response instanceof Error) return;

                const promessas = response.map((info: IClubeCampeonato) => {
                    return Api.get(`/clubes/${info.clubeId}`);
                });

                const clubesRes = await Promise.all(promessas);

                let clubes: IClube[] = [];
                clubesRes.forEach((res) => {
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

                const jogadoresAssistsArray = Object.keys(jogadoresGols).map((jogadorId) => ({
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

                setJogadoresAssists(jogadoresAssistsArray.sort((a, b) => {
                    if (b.assistencias !== a.assistencias) {
                        return b.assistencias - a.assistencias;
                    } else {
                        return a.nome.localeCompare(b.nome);
                    }
                }));

                const tabelaAtt = response.map((data) => {
                    const clube = clubesRes.find(clube => clube.data.id === data.clubeId);

                    return {
                        ...data,
                        fotoUrl: clube ? clube.data.fotoUrl : 'foto não encontrada',
                        nomeClube: clube ? clube.data.nome : 'Nome não encontrado',
                        pontos: (data.vitorias * 3) + (data.empates),
                    };
                }).sort((a, b) => {
                    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
                    return b.golsPro - a.golsPro;
                });

                setClubStats(tabelaAtt);


            } catch (error) {
                console.log(error);
            }
        }
        obterDados();
    }, [id]);

    useEffect(() => {
        async function handleRodadas() {
            try {
                const response = await Api.get(`/campeonatos/${id}/jogos`);
                if (response.status === 200) {
                    const jogosRodada = response.data.filter((jogoRodata: IJogo) => jogoRodata.rodada === rodada);
                    setJogos(jogosRodada);
                }
            } catch (error) {
                console.log(error);
                toast.error("Erro ao buscar jogos");
            }
        }
        handleRodadas();
    }, [rodada, id]);

    function encontrarCampeonato() {
        if (campId.length > 0) {
            window.location.href = `http://localhost:5173/campeonato/${campId}`;
        }
    }

    const currentGames = jogos.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getCorClass = (index: number) => {
        if (index < 6) return 'bg-green-500';
        if (index >= 6 && index < 12) return 'bg-blue-500';
        if (index >= 16) return 'bg-red-500';
        return '';
    };

    return (
        <main className="p-4">
            <section className="m-auto w-full max-w-screen-xl flex flex-col gap-4">
                {campeonato ? (
                    <>
                        <Card className="p-4">
                            <div className="flex justify-between gap-4 max-[768px]:flex-col">
                                <div className="flex gap-4">
                                    <img className="w-[150px] h-[150px] object-contain" src={campeonato?.fotoUrl} alt="" />
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-3xl">{campeonato?.nome}</h2>
                                        <p>Data Início: {formatarDataString(campeonato.dataInicio)}</p>
                                        <p>Data Fim: {formatarDataString(campeonato.dataFim)}</p>
                                        <p>N° de times: {campeonato.quantidadeTimes}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <Card className="flex items-center justify-between p-4 gap-2 rounded-lg">
                                        <span className="font-semibold">Receber notificações para os jogos desta liga</span>
                                        <Button variant="secondary" className="flex gap-1">
                                            Seguir <Bell />
                                        </Button>
                                    </Card>
                                    <div className="flex justify-end items-center gap-2">
                                        <p>Status do campeonato: {campeonato.status.toUpperCase()}</p>
                                        <div className="w-[20px] h-[20px] bg-green-700 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex gap-4">
                            <div className="w-[800px]">
                                <h1 className="text-xl">Tabela do Campeonato</h1>
                                <Table className="w-full border border-gray-500">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead></TableHead>
                                            <TableHead></TableHead>
                                            <TableHead>Clube</TableHead>
                                            <TableHead>P</TableHead>
                                            <TableHead>J</TableHead>
                                            <TableHead>V</TableHead>
                                            <TableHead>E</TableHead>
                                            <TableHead>D</TableHead>
                                            <TableHead>GF</TableHead>
                                            <TableHead>GS</TableHead>
                                            <TableHead>SG</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clubsStats.map((clube, index) => (
                                            <TableRow key={clube.id}>
                                                <TableCell className="flex justify-center">
                                                    <span className={`font-black text-white ${getCorClass(index)} rounded-full p-3 w-[20px] h-[20px] flex justify-center items-center`}>
                                                        {index + 1}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <img
                                                        alt="club image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="35"
                                                        src={clube.fotoUrl}
                                                        width="35"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {clube.nomeClube}
                                                </TableCell>
                                                <TableCell>
                                                    {(clube.vitorias * 3) + (clube.empates)}
                                                </TableCell>
                                                <TableCell>
                                                    {clube.vitorias + clube.empates + clube.derrotas}
                                                </TableCell>
                                                <TableCell>
                                                    {clube.vitorias}
                                                </TableCell>
                                                <TableCell>
                                                    {clube.empates}
                                                </TableCell>
                                                <TableCell>
                                                    {clube.derrotas}
                                                </TableCell>
                                                <TableCell className="max-sm:hidden">
                                                    {clube.golsPro}
                                                </TableCell>
                                                <TableCell className="max-sm:hidden">
                                                    {clube.golsContra}
                                                </TableCell>
                                                <TableCell>
                                                    {clube.golsPro - clube.golsContra}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-xl">Jogos da Liga</h1>
                                <div className="w-full flex justify-around items-center mt-6 space-x-2">
                                    <ChevronLeft className="cursor-pointer" onClick={() => setRodada(prev => Math.max(prev - 1, 1))}></ChevronLeft>
                                    <span className="px-4 py-2 text-lg">{rodada} / {perPage}</span>
                                    <ChevronRight className="cursor-pointer" onClick={() => setRodada(prev => Math.min(prev + 1, perPage))}></ChevronRight>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {currentGames.length > 0 ? (
                                        currentGames.map((jogo) => {
                                            const clube1 = clubsStats.find((clube) => clube.id === jogo.clube1Id);
                                            const clube2 = clubsStats.find((clube) => clube.id === jogo.clube2Id);
                                            return clube1 && clube2 && (
                                                <Card className="p-2 flex flex-col items-center gap-1" key={jogo.id}>
                                                    <div className="flex gap-1">
                                                        <img className="w-[20px]" src={clube1.fotoUrl} alt="" />
                                                        <p>{clube1.nomeClube} {jogo.golClube1} x {jogo.golClube2} {clube2.nomeClube}</p>
                                                        <img className="w-[20px]" src={clube2.fotoUrl} alt="" />
                                                    </div>
                                                    <p>{jogo.localJogo} - {jogo.horaJogo}</p>
                                                </Card>
                                            )
                                        })
                                    ) : (
                                        <Card className="p-2 flex flex-col items-center gap-1">
                                            <p>Nenhum jogo encontrado</p>
                                        </Card>
                                    )}
                                </div>

                            </div>
                        </div>


                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl">Melhores Jogadores</h2>
                            <div className="flex gap-2">
                                <div className="w-[50%]">
                                    <h2>Artilheiros</h2>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Jogador</TableHead>
                                                <TableHead>Gols</TableHead>
                                                <TableHead className="text-center px-4"><Eye /></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {jogadoresStats.map((jogStats) =>
                                                jogStats.gols > 1 && (
                                                    <TableRow key={jogStats.jogadorId}>
                                                        <TableCell className="font-medium">
                                                            <img
                                                                alt="club image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height="50"
                                                                src={jogStats.fotoUrl}
                                                                width="50"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {jogStats.nome}
                                                        </TableCell>
                                                        <TableCell>
                                                            {jogStats.gols}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        aria-haspopup="true"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Toggle menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className='flex flex-col gap-2' align="end">
                                                                    <PlayerInfo jogador={jogStats} />
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}

                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="w-[50%]">
                                    <h2>Garçons</h2>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="sr-only">Image</span>
                                                </TableHead>
                                                <TableHead>Jogador</TableHead>
                                                <TableHead>Assistências</TableHead>
                                                <TableHead className="text-center px-4"><Eye /></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {jogadoresAssists.map((jogStats) => (
                                                jogStats.assistencias > 1 &&
                                                <TableRow key={jogStats.jogadorId}>
                                                    <TableCell className="font-medium">
                                                        <img
                                                            alt="club image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height="50"
                                                            src={jogStats.fotoUrl}
                                                            width="50"
                                                        />
                                                    </TableCell>
                                                    <TableCell >
                                                        {jogStats.nome}
                                                    </TableCell>
                                                    <TableCell>
                                                        {jogStats.assistencias}
                                                    </TableCell>

                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    aria-haspopup="true"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className='flex flex-col gap-2' align="end">
                                                                <PlayerInfo jogador={jogStats} />
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </>

                ) : (
                    <div>
                        <h1>Informe O ID do campeonato</h1>
                        <Input onChange={(e) => setCampId(e.target.value)} type="text" />
                        <Button onClick={() => encontrarCampeonato()}>Procurar Campeonato</Button>
                    </div>
                )}
            </section>
        </main>
    )
}

export default ViewStats;
