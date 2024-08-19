import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { IJogador } from "../../../../interfaces/Jogador";
import { Input } from "../../../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatejogadorValidationSchema } from "../../../../utils/updateJogadorValidation";
import { formatFile } from "../../../../utils/formatFile";
import FileInformation from "../../../../interfaces/FileInformation";
import { storage } from "../../../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Label } from "../../../ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthProvider/useAuth";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { IPosicao } from "../../../../interfaces/Posicao";
import { Progress } from "../../../ui/progress";

interface AddJogadorProps {
    jogador: IJogador;
    posicoes: IPosicao[];
    handleUpdatePlayer: (data: IJogador) => void;
}

function UpdatePlayer({ jogador, posicoes, handleUpdatePlayer }: AddJogadorProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>();
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<IJogador, 'id' | 'clubeId'>>({
        resolver: yupResolver(updatejogadorValidationSchema),
        mode: 'onChange',
        defaultValues: {
            nome: jogador.nome,
            posicaoId: jogador.posicaoId,
            nacionalidade: jogador.nacionalidade,
            numeroCamisa: jogador.numeroCamisa,
            dataNascimento: jogador.dataNascimento,
            fotoUrl: jogador.fotoUrl,
        }
    });

    async function handlepromiseFoto(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const uploadedPromises = await formatFile(e.target.files[0], auth.id, (progress) => {
                setProgress(progress);
            });

            setPromiseFoto(uploadedPromises);
            form.setValue('fotoUrl', uploadedPromises.downloadURL);
        }
    }

    function deleteFile(e: FileInformation) {

        const deleteFile = confirm("Deseja remover o arquivo?")
        if (deleteFile) {

            const fileRef = ref(storage, e.downloadURL)
            deleteObject(fileRef).then(() => {
                console.log("arquivo deletado com sucesso!");
                toast.success("Arquivo deletado");
                setPromiseFoto(null)
                form.setValue('fotoUrl', '');
                setProgress(0);

            }).catch((error) => {
                console.log(error + ": erro ao deletar");
                toast.error("Erro ao deletar")
            });
        }
    }

    useEffect(() => {
        form.reset();
        setPromiseFoto(null);
        setProgress(0);
    }, [isDialogOpen]);

    const onSubmit: SubmitHandler<Omit<IJogador, 'id' | 'clubeId'>> = (data) => {
        handleUpdatePlayer({ ...data, id: jogador.id, clubeId: jogador.clubeId });
        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <Label className="cursor-pointer">Editar</Label>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atualizar Jogador</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <FormField control={form.control} name="fotoUrl" render={() => (
                            <FormItem>
                                <FormLabel>Foto do jogador</FormLabel>
                                <FormControl>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input
                                            onChange={handlepromiseFoto}
                                            id="picture"
                                            type="file"
                                            className="hidden"
                                        />
                                        <Label htmlFor="picture" className="block w-full text-sm text-center text-white bg-blue-500 transition transition-duration: 150ms hover:bg-blue-600 cursor-pointer rounded-lg p-2">
                                            Anexe a foto
                                        </Label>
                                        {promiseFoto ? (
                                            <div className="flex justify-between items-center">
                                                <Link className="text-blue-500 underline" target="_blank" to={`${promiseFoto?.downloadURL}`}>
                                                    {promiseFoto?.name}
                                                </Link>
                                                {promiseFoto && <FontAwesomeIcon onClick={() => deleteFile(promiseFoto)} icon={faX} className="text-red-500 cursor-pointer" />}
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
                                    <Input placeholder="Nome do jogador" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="nacionalidade" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nacionalidade</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Brasileiro" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="numeroCamisa" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número da camisa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 10" {...field} type="number" />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="posicaoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Posição</FormLabel>
                                    <Select defaultValue={String(field.value)} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue>{posicoes.find(pos => pos.id === field.value)?.nome}</SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {posicoes.map((posicao) => (
                                                <SelectItem key={posicao.id} value={String(posicao.id)}>
                                                    {posicao.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Nascimento</FormLabel>
                                <FormControl>
                                    <Input
                                        className="mt-1 block w-full  px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit">Atualizar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePlayer;
