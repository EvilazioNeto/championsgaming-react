import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { campeonatoValidationSchema } from "../../../utils/campeonatoValidation";
import { ICampeonato } from "../../../interfaces/Campeonato";
import { useAuth } from "../../../contexts/AuthProvider/useAuth";
import FileInformation from "../../../interfaces/FileInformation";
import { formatFile } from "../../../utils/formatFile";
import { storage } from "../../../firebase";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Progress } from "../../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface UpdateLeagueProps {
    handleUpdateLeague: (data: ICampeonato) => void;
    liga: ICampeonato;
}

function UpdateLeague({ handleUpdateLeague, liga }: UpdateLeagueProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<ICampeonato, 'id' | 'usuarioId' | 'status' | 'numeroRodadas'>>({
        resolver: yupResolver(campeonatoValidationSchema),
        mode: 'onChange',
        defaultValues: {
            dataFim: liga.dataFim,
            dataInicio: liga.dataInicio,
            nome: liga.nome,
            fotoUrl: liga.fotoUrl,
            quantidadeTimes: liga.quantidadeTimes
        }
    });

    const onSubmit = (data: Omit<ICampeonato, 'id' | 'usuarioId' | 'status' | 'numeroRodadas'>) => {
        handleUpdateLeague({ ...data, id: liga.id, usuarioId: liga.usuarioId, numeroRodadas: 2 * (data.quantidadeTimes - 1), status: "ativo" });
        setIsDialogOpen(false)
        deleteFile(liga.fotoUrl)
        form.reset();
    };

    useEffect(() => {
        form.reset({
            dataFim: liga.dataFim,
            dataInicio: liga.dataInicio,
            nome: liga.nome,
            fotoUrl: liga.fotoUrl,
            quantidadeTimes: liga.quantidadeTimes
        });
        setPromiseFoto(null);
        setProgress(0)
    }, [isDialogOpen]);

    async function handlepromiseFoto(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const uploadedPromises = await formatFile(e.target.files[0], auth.id, (progress) => {
                setProgress(progress);
            });

            setPromiseFoto(uploadedPromises);
            form.setValue('fotoUrl', uploadedPromises.downloadURL);
        }
    }

    function deleteFile(url: string) {
        const fileRef = ref(storage, url)
        deleteObject(fileRef).then(() => {
            console.log("arquivo deletado com sucesso!");
            setPromiseFoto(null)
            form.setValue('fotoUrl', '');
            setProgress(0);

        }).catch((error) => {
            console.log(error + ": erro ao deletar");
            toast.error("Erro ao deletar foto")
        });
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="secondary" type="button">Editar liga</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar liga</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="fotoUrl" render={() => (
                            <FormItem>
                                <FormLabel>Logo da liga</FormLabel>
                                <FormControl>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input
                                            onChange={handlepromiseFoto}
                                            id="picture"
                                            type="file"
                                            className="hidden"
                                        />
                                        <Label htmlFor="picture" className="block w-full text-sm text-center text-white bg-blue-500 transition transition-duration: 150ms hover:bg-blue-600 cursor-pointer rounded-lg p-2">
                                            Substituir foto
                                        </Label>
                                        {liga.fotoUrl ? (
                                            <div className="flex flex-col">
                                                <div>
                                                    <Label>Foto Atual: </Label>
                                                    <Link className="text-blue-500 underline" target="_blank" to={`${liga.fotoUrl}`}>
                                                        Foto-{liga.nome}
                                                    </Link>
                                                </div>
                                                {promiseFoto && (
                                                    <div>
                                                        <Label>Nova Foto: </Label>
                                                        <Link className="text-blue-500 underline" target="_blank" to={promiseFoto.downloadURL}>
                                                            {promiseFoto.name}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            progress > 0 && <Progress value={progress} />
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="nome" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome da liga" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dataInicio" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Início</FormLabel>
                                <FormControl>
                                    <Input
                                        className="mt-1 block w-full  px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dataFim" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Fim</FormLabel>
                                <FormControl>
                                    <Input
                                        className="mt-1 block w-full  px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="quantidadeTimes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantidade de Times</FormLabel>
                                    <Select defaultValue={String(field.value)} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue>{field.value}</SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, index) => index * 2 + 2).map((quantidade) => (
                                                <SelectItem key={quantidade} value={String(quantidade)}>
                                                    {quantidade} times
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>

                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Editar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateLeague;