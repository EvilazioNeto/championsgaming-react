import { useEffect, useState } from 'react';
import styles from './minhasLigas.module.css';
import { Api } from '../../../services/api/axios-config';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { Tabs, TabsContent } from '../../../components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/pagination';
import { Button } from '../../../components/ui/button';
import { MoreHorizontal, Shield, Table2, TrendingUp } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../../components/ui/alert-dialog';
import { Label } from '../../../components/ui/label';
import AddLeague from '../../../components/Modal/League/AddLeague';
import UpdateLeague from '../../../components/Modal/League/UpdateLeague';
import { Compartilhar } from '../../../components/Modal/Compartilhar';

export default function MinhasLigas() {
    const auth = useAuth();
    const [campeonatos, setCampeonatos] = useState<ICampeonato[]>([])

    useEffect(() => {
        async function obterCampeonatos() {
            try {
                const response = await Api.get(`/usuario/${auth.id}/campeonatos`)

                if (response.status === 200) {
                    setCampeonatos(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao buscar os campeonatos')
            }
        }
        obterCampeonatos();
    }, [auth.id]);

    async function deletarPorId(campeonato: ICampeonato) {
        try {
            const response = await Api.delete(`/campeonatos/${campeonato.id}`)
            if (response.status === 200) {
                toast.success('Liga deletada com sucesso')

                const index = campeonatos.indexOf(campeonato);
                campeonatos.splice(index, 1)
                setCampeonatos([...campeonatos]);
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro ao deletar o campeonato')
        }
    }

    async function handleAddLeague(data: Omit<ICampeonato, 'id'>) {
        try {
            const response = await Api.post("/campeonatos", data)

            if (response.status === 201) {
                toast.success('Liga criada com sucesso');
                const novoCampeonato: ICampeonato = {
                    ...data,
                    id: response.data
                }

                setCampeonatos([...campeonatos, novoCampeonato])
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro ao criar liga');
        }
    }

    async function handleUpdateLeague(data: ICampeonato) {
        console.log(data)
        const response = await Api.put(`/campeonatos/${data.id}`, data);

        if (response.status === 200) {
            toast.success("Liga Atualizada")
            const ligaAnterior = campeonatos.find((campeonato) => campeonato.id === data.id)
            if (ligaAnterior) {
                const i = campeonatos.indexOf(ligaAnterior);
                campeonatos.splice(i, 1);
                setCampeonatos([...campeonatos, data]);
            }

        }
    }

    return (
        <main className={styles.minhasLigasContainer}>
            <section className='m-auto w-full max-w-screen-xl flex flex-col gap-4'>
                <Breadcrumb className='pb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to={`/minhas-ligas`}>Gerenciar Ligas</Link>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='flex justify-between'>
                    <h1 className='text-2xl'>Gerenciar Ligas</h1>
                    <AddLeague handleAddLeague={handleAddLeague} />
                </div>

                <Tabs defaultValue="all">
                    <TabsContent value="all">
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Ligas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="hidden w-[100px] sm:table-cell">
                                                <span className="sr-only">Image</span>
                                            </TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead className="text-center hidden md:table-cell">
                                                Clubes
                                            </TableHead>
                                            <TableHead className="text-center  hidden md:table-cell">
                                                Tabela
                                            </TableHead>
                                            <TableHead className="text-center hidden md:table-cell">
                                                Jogos
                                            </TableHead>
                                            <TableHead className="text-center hidden md:table-cell">
                                                Estatísticas
                                            </TableHead>

                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {campeonatos.map((campeonato) => (
                                            <TableRow key={campeonato.id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <img
                                                        alt="club image"
                                                        className="aspect-square rounded-md object-cover"
                                                        height="64"
                                                        src={campeonato.fotoUrl}
                                                        width="64"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {campeonato.nome}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link to={`/minhas-ligas/${campeonato.id}/clubes`}>
                                                        <Button className='w-full m-auto' variant='secondary' type='button'>
                                                            <Shield />
                                                        </Button>
                                                    </Link>
                                                </TableCell>


                                                <TableCell className="font-medium">
                                                    <Link to={`/minhas-ligas/${campeonato.id}/tabela`}>
                                                        <Button className='w-full m-auto' variant='secondary' type='button'>
                                                            <Table2 />
                                                        </Button>
                                                    </Link>
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    <Link to={`/minhas-ligas/${campeonato.id}/jogos`}>
                                                        <Button className='w-full m-auto' variant='secondary' type='button'>
                                                            <FontAwesomeIcon className='w-6 h-6' icon={faFutbol} />
                                                        </Button>
                                                    </Link>
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    <Link to={`/minhas-ligas/${campeonato.id}/estatisticas`}>
                                                        <Button className='w-full m-auto' variant='secondary' type='button'>
                                                            <TrendingUp />
                                                        </Button>
                                                    </Link>
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
                                                            <UpdateLeague handleUpdateLeague={handleUpdateLeague} liga={campeonato} />
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
                                                                            Isso excluirá permanentemente: {campeonato.nome}.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => deletarPorId(campeonato)}>Continuar</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            <Compartilhar id={campeonato.id}/>
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
                                    Mostrando <strong>1-10</strong> de <strong>{campeonatos.length}</strong>{" "}
                                    Ligas
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
            </section>
        </main>
    )
}