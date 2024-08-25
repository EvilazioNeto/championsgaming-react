import { useEffect, useState } from 'react';
import styles from './gerenciarClube.module.css';
import { IClube } from '../../../interfaces/Clube';
import { IClubeCampeonato } from '../../../interfaces/ClubeCampeonato';
import { Api } from '../../../services/api/axios-config';
import { toast } from 'react-toastify';
import { ICampeonato } from '../../../interfaces/Campeonato';
import AddClub from '../../../components/Modal/Club/AddClub/AddClub';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import { useParams } from 'react-router-dom';
import AddPlayer from '../../../components/Modal/Player/AddPlayer/AddPlayer';
import { IJogador } from '../../../interfaces/Jogador';
import { formatToDate } from '../../../utils/formatToDate';
import { IPosicao } from '../../../interfaces/Posicao';
import UpdatePlayer from '../../../components/Modal/Player/UpdatePlayer/UpdatePlayer';
import { calcularIdade } from '../../../utils/calcularIdade';
import Loading from '../../../components/Loading/Loading';
import UpdateClub from '../../../components/Modal/Club/UpdateClub/UpdateClub';
import { atualizarJogadorPorId, criarJogador, deletarJogadorPorId, obterJogadoresDoClubePorId, obterPosicoes } from '../../../services/player/playerService';
import { criarClube, criarClubeCampeonatoEstatisticas, deletarCampeonatoClubeEstatisticas, deletarClubePorId, getCampeonatoEstatisticas } from '../../../services/club/clubService';
import { Button } from '../../../components/ui/button';
import { DeletarItemModal } from '../../../components/Modal/Deletar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { ClipboardMinus, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';
import { Label } from '../../../components/ui/label';
import ITreinador from '../../../interfaces/Treinador';
import AddCoach from '../../../components/Modal/Coach/AddCoach';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/pagination';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import UpdateCoach from '../../../components/Modal/Coach/UpdateCoach';

function GerenciarClubes() {
    const [loading, setLoading] = useState<boolean>(false)
    const [arrClubs, setArrClubs] = useState<IClube[]>([]);
    const [clubeSelecionado, setClubeSelecionado] = useState<IClube | null>(null)
    const [campeonato, setCampeonato] = useState<ICampeonato>({} as ICampeonato);
    const [jogadores, setJogadores] = useState<IJogador[]>([])
    const { id } = useParams();
    const auth = useAuth();
    const [posicoes, setPosicoes] = useState<IPosicao[]>([]);
    const [treinador, setTreinador] = useState<ITreinador | null>(null);
    const [btnSelected, setBtnSelected] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        obterPosicoes().then(data => {
            setPosicoes(data);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        async function obterDados() {
            try {
                setLoading(true)
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

                    if (clubes.length > 0) {
                        setClubeSelecionado(clubes[0]);
                        setBtnSelected(clubes[0].nome)
                        const treinadorRes = await Api.get(`/clubes/${clubes[0].id}/treinador`)
                        if (treinadorRes.status === 200) {
                            if (treinadorRes.data.length > 0) {
                                setTreinador(treinadorRes.data[0]);
                            }
                        }

                        const playerResponse = await obterJogadoresDoClubePorId(clubes[0].id);

                        if (playerResponse instanceof Error) {
                            return;
                        } else {
                            setJogadores(playerResponse)
                        }
                    }
                    setLoading(false)
                }
                setLoading(false)

            } catch (error) {
                setLoading(false)
                console.log(error);
                toast.error('Erro ao consultar dados');
            }
        }
        obterDados();

    }, [id, auth.id]);

    async function removeClub(data: IClube) {
        try {
            const clubesEstatisticas = await getCampeonatoEstatisticas(campeonato.id)
            if (clubesEstatisticas instanceof Error) {
                return;
            } else {
                const clubeTabelaInfo: IClubeCampeonato[] = clubesEstatisticas.filter((clubesEstatistica: IClubeCampeonato) => clubesEstatistica.clubeId === data.id)

                const delTabelaInfoRes = await deletarCampeonatoClubeEstatisticas(clubeTabelaInfo[0].id)

                if (delTabelaInfoRes instanceof Error) {
                    return;
                } else {
                    const jogadoresClubRes = await obterJogadoresDoClubePorId(data.id)

                    if (jogadoresClubRes instanceof Error) {
                        return;
                    } else {
                        await Promise.all(
                            jogadoresClubRes.map((jogador: IJogador) => Api.delete(`/jogadores/${jogador.id}`))
                        );
                    }

                    const response = await deletarClubePorId(data.id)

                    if (response instanceof Error) {
                        return;
                    } else {
                        const i = arrClubs.indexOf(data)
                        arrClubs.splice(i, 1)
                        setArrClubs([...arrClubs]);
                        setClubeSelecionado(arrClubs[0])
                        getClubPlayers(arrClubs[0])
                    }

                }
            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao deletar clube")
        }
    }

    async function handleAddClub(data: Omit<IClube, 'id'>) {
        try {
            const response = await criarClube(data)

            if (typeof response === 'number') {
                const novoClube: IClube = {
                    ...data,
                    id: response
                }

                setArrClubs([...arrClubs, novoClube])

                if(!clubeSelecionado){
                    setClubeSelecionado(novoClube);
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

                await criarClubeCampeonatoEstatisticas(infoClubeTabela)
            }

        } catch (error) {
            console.log(error)
            toast.error("Erro ao criar clube")
        }
    }

    async function handleUpdateClub(data: IClube) {
        try {
            const response = await Api.put(`/clubes/${data.id}`, data);

            if (response.status === 204) {
                toast.success("Clube atualizado")

                const clubesAtualizados = arrClubs.filter(clube => clube.id !== data.id);
                setArrClubs([...clubesAtualizados, data]);
            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao atualizar clube")
        }
    }

    async function handleAddPlayer(data: Omit<IJogador, 'id'>) {
        try {
            const dados = {
                nome: data.nome,
                dataNascimento: formatToDate(data.dataNascimento),
                posicaoId: data.posicaoId,
                nacionalidade: data.nacionalidade,
                numeroCamisa: Number(data.numeroCamisa),
                clubeId: data.clubeId,
                fotoUrl: data.fotoUrl
            }
            console.log(dados)
            const response = await criarJogador(dados)

            if (typeof response === 'number') {
                const novoJogador = {
                    ...dados,
                    id: response
                }

                setJogadores([...jogadores, novoJogador])
            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao adicionar jogador")
        }
    }

    async function getClubPlayers(club: IClube) {
        setClubeSelecionado(club);
        setBtnSelected(club.nome);
        setLoading(true);

        const treinadorRes = await Api.get(`/clubes/${club.id}/treinador`)
        if (treinadorRes.status === 200) {
            if (treinadorRes.data.length > 0) {
                setTreinador(treinadorRes.data[0]);
            } else {
                setTreinador(null);
            }
        }

        try {
            const response = await obterJogadoresDoClubePorId(club.id)

            if (response instanceof Error) {
                return;
            } else {
                setJogadores(response)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function deletePlayer(jogador: IJogador) {
        try {
            const response = await deletarJogadorPorId(jogador.id)

            if (response === undefined || response === null) {
                const index = jogadores.indexOf(jogador);
                jogadores.splice(index, 1);
                setJogadores([...jogadores]);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function updadePlayer(jogadorAtt: IJogador) {
        const dadosAtt: IJogador = {
            ...jogadorAtt,
            numeroCamisa: parseInt(jogadorAtt.numeroCamisa),
            dataNascimento: formatToDate(jogadorAtt.dataNascimento),

        }
        try {
            const response = await atualizarJogadorPorId(jogadorAtt.id, dadosAtt)
            if (response instanceof Error) {
                return;
            } else {
                const jogadoresAtualizados = jogadores.filter(jogador => jogador.id !== dadosAtt.id);
                setJogadores([...jogadoresAtualizados, dadosAtt]);
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function handleAddCoach(data: Omit<ITreinador, 'id'>) {
        try {
            const dados = {
                nome: data.nome,
                dataNascimento: formatToDate(data.dataNascimento),
                nacionalidade: data.nacionalidade,
                clubeId: data.clubeId,
                fotoUrl: data.fotoUrl
            }
            const response = await Api.post("/treinadores", dados);
            console.log(response)

            if (typeof response.data === 'number') {
                const novoTreinador: ITreinador = {
                    ...dados,
                    id: response.data
                }
                console.log(novoTreinador)

                setTreinador(novoTreinador)
                toast.success("Treinador adicionado com sucesso!");
            }
        } catch (error) {
            console.log(error)
            toast.error("Erro ao adicionar treinador")
        }
    }

    async function handleUpdateCoach(treinador: ITreinador) {
        console.log(treinador)
        const dadosAtt: ITreinador = {
            ...treinador,
            dataNascimento: formatToDate(treinador.dataNascimento),

        }
        try {
            const response = await Api.put(`/treinadores/${treinador.id}`, dadosAtt)
            if (response.status === 200) {
                setTreinador(dadosAtt);
                toast.success("Treinador Atualizado")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <main className={styles.gerenciarClubeContainer}>
                <section className='m-auto w-full max-w-screen-xl flex flex-col gap-4'>
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
                                        <DropdownMenuItem>
                                            <Link to="/criar-liga">Criar Liga</Link>
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
                                <BreadcrumbPage>Clubes</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className='flex justify-between'>
                        <h1 className='text-2xl'>Gerenciar Clubes</h1>
                        {arrClubs.length < campeonato.quantidadeTimes && (
                            <AddClub handleAddClube={handleAddClub} />
                        )}
                    </div>
                    {arrClubs.length > 0 ? (
                        <>
                            <Carousel opts={{ align: "start" }} className="w-full max-w-[200px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[650px] xl:max-w-[800px] 2xl:max-w-[1100px] mx-auto">
                                <CarouselContent>
                                    {arrClubs.map((clube, index) => (
                                        <CarouselItem key={index} className="sm:basis-1/1 md:basis-1/2 lg:basis-1/4 xl:basis-1/6">
                                            <div className="p-1">
                                                <Card onClick={() => getClubPlayers(clube)} className={`${btnSelected === clube.nome ? 'bg-slate-500 text-slate-50' : ''} transition duration-200 ease-out hover:bg-slate-500 hover:text-slate-50`} >
                                                    <CardContent className="cursor-pointer flex items-center justify-center p-4">
                                                        <span className="flex gap-2 items-center font-semibold">
                                                            <img className="sm:block md:hidden 2xl:block max-w-8 max-h-8" src={clube.fotoUrl} alt={clube.nome} />
                                                            {clube.nome}
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>

                            <Card className='flex justify-between max-[1170px]:items-start gap-4 p-4 border rounded-lg'>
                                <div className='flex gap-4 max-[1170px]:flex-col'>
                                    <div className='flex items-center gap-4 max-[768px]:flex-col '>
                                        <img className='w-[150px] h-[150px] object-contain' src={clubeSelecionado?.fotoUrl} alt="" />
                                        <div className='flex flex-col gap-2'>
                                            <h2 className='text-3xl'>{clubeSelecionado?.nome}</h2>
                                            <p>Jogadores: {jogadores.length}</p>
                                            <p>Média de idade: {jogadores.length > 0 ? (jogadores.reduce((acc, jogador) => acc + calcularIdade(jogador.dataNascimento), 0) / jogadores.length).toFixed(2) : 0}</p>
                                            <p>Classificação: x°</p>
                                            <p>Mascote: {clubeSelecionado?.mascote}</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-4'>
                                        {treinador && (
                                            <div className='border-l px-4 max-[1170px]:border-none max-[1170px]:px-0 flex gap-2'>
                                                <img
                                                    className='w-[80px] h-[80px] aspect-square rounded-md object-cover'
                                                    src={treinador.fotoUrl} alt=""
                                                />
                                                <div className='flex flex-col gap-1'>
                                                    <p>{treinador.nome}</p>
                                                    <p>{treinador.nacionalidade}</p>
                                                    <p>Idade: {calcularIdade(treinador.dataNascimento)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {campeonato && (
                                            <div className='max-[1170px]:border-none max-[1170px]:px-0 flex gap-2'>
                                                <img
                                                    className='w-[80px] h-[80px] aspect-square object-cover'
                                                    src={campeonato.fotoUrl} alt=""
                                                />
                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-xl'>{campeonato.nome}</p>     
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='flex flex-col gap-2'>
                                        {clubeSelecionado && (
                                            <>
                                                <DeletarItemModal itemExcluido={clubeSelecionado.nome} deletarItem={() => removeClub(clubeSelecionado)} />
                                                <UpdateClub handleUpdateClube={handleUpdateClub} clube={clubeSelecionado} />
                                                {treinador ? (
                                                    <UpdateCoach treinador={treinador} handleUpdateCoach={handleUpdateCoach} />
                                                ) : (
                                                    <AddCoach clubeId={clubeSelecionado.id} handleAddCoach={handleAddCoach} />
                                                )}
                                                <Button variant="secondary" className='flex justify-between gap-2'>Estatísticas <ClipboardMinus /></Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            <Tabs defaultValue="todos">
                                <div className="flex items-center">
                                    <TabsList>
                                        <TabsTrigger value="todos">Todos</TabsTrigger>
                                        <TabsTrigger value="active">Ataque</TabsTrigger>
                                        <TabsTrigger value="draft">Meio Campo</TabsTrigger>
                                        <TabsTrigger value="defesa">Defesa</TabsTrigger>
                                    </TabsList>
                                    <div className="ml-auto flex items-center gap-2">
                                        <AddPlayer clubeId={clubeSelecionado?.id} posicoes={posicoes} handleAddPlayer={handleAddPlayer} />
                                    </div>
                                </div>
                                <TabsContent value="todos">
                                    <Card x-chunk="dashboard-06-chunk-0">
                                        <CardHeader>
                                            <CardTitle>Jogadores</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="hidden w-[100px] sm:table-cell">
                                                            <span className="sr-only">Image</span>
                                                        </TableHead>
                                                        <TableHead>Nome</TableHead>
                                                        <TableHead className="hidden md:table-cell">
                                                            Posição
                                                        </TableHead>
                                                        <TableHead className="hidden md:table-cell">
                                                            Idade
                                                        </TableHead>
                                                        <TableHead className="hidden md:table-cell">
                                                            Número Camisa
                                                        </TableHead>
                                                        <TableHead className="hidden md:table-cell">
                                                            Nacionalidade
                                                        </TableHead>
                                                        <TableHead>
                                                            <span className="sr-only">Actions</span>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {jogadores.map((jogador) => (
                                                        <TableRow key={jogador.id}>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <img
                                                                    alt="player image"
                                                                    className="aspect-square rounded-md object-cover"
                                                                    height="64"
                                                                    src={jogador.fotoUrl}
                                                                    width="64"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {jogador.nome}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline"> {posicoes.find(posicao => posicao.id === jogador.posicaoId)?.nome}</Badge>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {calcularIdade(jogador.dataNascimento)} anos
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {jogador.numeroCamisa}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {jogador.nacionalidade}
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
                                                                        <UpdatePlayer jogador={jogador} posicoes={posicoes} handleUpdatePlayer={updadePlayer} />
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button variant="secondary">
                                                                                    <Label className="cursor-pointer">Excluir</Label>
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        Essa ação não pode ser desfeita.
                                                                                        Isso excluirá permanentemente: {jogador.nome}.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                    <AlertDialogAction onClick={() => deletePlayer(jogador)}>Continuar</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                        <CardFooter className='flex justify-between'>
                                            <div className="text-xs text-muted-foreground">
                                                Mostrando <strong>1-10</strong> de <strong>{jogadores.length}</strong>{" "}
                                                jogadores
                                            </div>
                                            <Pagination className='w-auto m-0'>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious href="#" />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">1</PaginationLink>
                                                        <PaginationLink href="#">2</PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationNext href="#" />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
                            <CardHeader className="bg-slate-800 text-white p-4">
                                <h2 className="text-xl font-semibold">Gerenciamento Completo dos Clubes</h2>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-gray-700 mb-4">
                                    Aqui você pode gerenciar todos os aspectos relacionados aos clubes, jogadores e outras entidades do campeonato.
                                </p>
                                <div className="entity-section mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Clubes</h3>
                                    <p className="text-gray-600">
                                        Adicione, edite ou remova clubes para manter seu campeonato atualizado.
                                    </p>
                                </div>
                                <div className="entity-section mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Jogadores</h3>
                                    <p className="text-gray-600">
                                        Gerencie o elenco dos clubes, adicionando novos jogadores, editando informações existentes ou removendo jogadores conforme necessário.
                                    </p>
                                </div>
                                <div className="entity-section mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Treinador</h3>
                                    <p className="text-gray-600">
                                        Gerencie o treinador clube, editando informações existentes ou removendo o treinador conforme necessário.
                                    </p>
                                </div>
                                <div className="entity-section">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Outras</h3>
                                    <p className="text-gray-600">
                                        Controle outras entidades relacionadas ao campeonato, como estatísticas dos jogadores, etc..
                                    </p>
                                </div>
                                <div className="entity-section">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Gráficos</h3>
                                    <p className="text-gray-600">
                                        Acesso aos gráficos com as estatísticas detalhadas dos jogadores
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </main>
        </>
    )
}

export default GerenciarClubes;
