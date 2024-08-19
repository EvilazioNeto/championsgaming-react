import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { jogadorValidationSchema } from "../../../../utils/jogadorValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { IJogador } from "../../../../interfaces/Jogador";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { IPosicao } from "../../../../interfaces/Posicao";
import { useEffect, useState } from "react";
import { Label } from "../../../ui/label";
import { formatFile } from "../../../../utils/formatFile";
import { useAuth } from "../../../../contexts/AuthProvider/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../../firebase";
import FileInformation from "../../../../interfaces/FileInformation";
import { Progress } from "../../../ui/progress";
import { PlusCircle } from "lucide-react";

interface AddPlayerProps {
    handleAddPlayer: (data: Omit<IJogador, 'id'>) => void;
    clubeId: number | undefined;
    posicoes: IPosicao[]
}

function AddPlayer({ handleAddPlayer, clubeId, posicoes }: AddPlayerProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<IJogador, 'id' | 'clubeId'>>({
        resolver: yupResolver(jogadorValidationSchema),
        mode: 'onChange',
        defaultValues: {
            nome: '',
            posicaoId: 1,
            nacionalidade: '',
            numeroCamisa: '',
            dataNascimento: '',
            fotoUrl: ''
        }
    });

    useEffect(() => {
        form.reset();
        setPromiseFoto(null);
        setProgress(0);
    }, [isDialogOpen]);

    const onSubmit = (data: Omit<IJogador, 'id' | 'clubeId'>) => {
        if (clubeId) {
            handleAddPlayer({ ...data, clubeId: clubeId });
        }
        setIsDialogOpen(false)
        form.reset();
    };


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

            const fileRef = ref(storage, `${e.downloadURL}`)
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

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar Jogador
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Jogador</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
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
                                    {/* <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover> */}
                                    <Input
                                        className="mt-1 block w-full  px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddPlayer;
