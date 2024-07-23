// import { useForm } from 'react-hook-form';
// import { useAuth } from '../../../../contexts/AuthProvider/useAuth';
// import styles from './AddClube.module.css';
// import { IClube } from '../../../../interfaces/Clube';
// import { clubValidationSchema } from '../../../../utils/clubValidation';
// import { yupResolver } from '@hookform/resolvers/yup';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { useAuth } from "../../../../contexts/AuthProvider/useAuth";
import { useEffect, useState } from "react";
import { clubValidationSchema } from "../../../../utils/clubValidation";
import { useForm } from "react-hook-form";
import { IClube } from "../../../../interfaces/Clube";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { Input } from "../../../ui/input";
import FileInformation from "../../../../interfaces/FileInformation";
import { formatFile } from "../../../../utils/formatFile";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../../firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Label } from "../../../ui/label";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Progress } from "../../../ui/progress";

interface AddClubProps {
    handleAddClube: (data: Omit<IClube, 'id'>) => void;
}

function AddClub({ handleAddClube }: AddClubProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<IClube, 'id' | 'usuarioId'>>({
        resolver: yupResolver(clubValidationSchema),
        mode: 'onChange',
        defaultValues: {
            nome: '',
            cor_principal: '#FF0000',
            cor_secundaria: '#000000',
            mascote: '',
            fotoUrl: ''
        }
    });

    const onSubmit = (data: Omit<IClube, 'id' | 'usuarioId'>) => {
        handleAddClube({ ...data, usuarioId: auth.id });
        setIsDialogOpen(false)
        form.reset();
    };

    useEffect(() => {
        form.reset();
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

    function deleteFile(e: FileInformation) {

        const deleteFile = confirm("Deseja remover o arquivo?")
        if (deleteFile) {

            const fileRef = ref(storage, `${e.downloadURL}`)
            deleteObject(fileRef).then(() => {
                console.log("arquivo deletado com sucesso!");
                toast.success("Arquivo deletado");
                setPromiseFoto(null)
                form.setValue('fotoUrl', '');
                setProgress(0)

            }).catch((error) => {
                console.log(error + ": erro ao deletar");
                toast.error("Erro ao deletar")
            });
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button type="button">ADICIONAR CLUBE</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar clube</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="fotoUrl" render={() => (
                            <FormItem>
                                <FormLabel>Foto do clube</FormLabel>
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
                                            progress > 0 && <Progress value={progress}/>
                                        )}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="nome" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do clube" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="mascote" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mascote</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do mascote" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cor_principal" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor Primária</FormLabel>
                                <FormControl>
                                    <Input type="color" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cor_secundaria" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor Secundária</FormLabel>
                                <FormControl>
                                    <Input type="color" {...field} />
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

export default AddClub;