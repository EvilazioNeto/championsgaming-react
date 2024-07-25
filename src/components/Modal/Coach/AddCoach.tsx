import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider/useAuth";
import FileInformation from "../../../interfaces/FileInformation";
import { useForm } from "react-hook-form";
import ITreinador from "../../../interfaces/Treinador";
import { yupResolver } from "@hookform/resolvers/yup";
import { coachValidationSchema } from "../../../utils/coachValidation";
import { formatFile } from "../../../utils/formatFile";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebase";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { AlertDialogFooter, AlertDialogHeader } from "../../ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from "../../ui/progress";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface AddPlayerProps {
    handleAddCoach: (data: Omit<ITreinador, 'id'>) => void;
    clubeId: number | undefined;
}

function AddCoach({ handleAddCoach, clubeId }: AddPlayerProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<ITreinador, 'id' | 'clubeId'>>({
        resolver: yupResolver(coachValidationSchema),
        mode: 'onChange',
        defaultValues: {
            nome: '',
            nacionalidade: '',
            dataNascimento: '',
            fotoUrl: ''
        }
    });

    useEffect(() => {
        form.reset();
        setPromiseFoto(null);
        setProgress(0);
    }, [isDialogOpen]);

    const onSubmit = (data: Omit<ITreinador, 'id' | 'clubeId'>) => {
        if (clubeId) {
            handleAddCoach({ ...data, clubeId: clubeId });
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
                <Button variant="secondary" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar treinador
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <DialogTitle>Adicionar Treinador</DialogTitle>
                </AlertDialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="fotoUrl" render={() => (
                            <FormItem>
                                <FormLabel>Foto do treinador</FormLabel>
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
                                    <Input placeholder="Nome do treinador" {...field} />
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

                        <AlertDialogFooter>
                            <Button type="submit">Adicionar</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCoach;
