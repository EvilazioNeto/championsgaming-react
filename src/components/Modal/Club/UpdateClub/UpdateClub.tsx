// import { useForm } from 'react-hook-form';
// import { useAuth } from '../../../../contexts/AuthProvider/useAuth';
// import styles from './UpdateClub.module.css';
// import { IClube } from '../../../../interfaces/Clube';
// import { clubValidationSchema } from '../../../../utils/clubValidation';
// import { yupResolver } from '@hookform/resolvers/yup';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IClube } from "../../../../interfaces/Clube";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../../contexts/AuthProvider/useAuth";
import FileInformation from "../../../../interfaces/FileInformation";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clubValidationSchema } from "../../../../utils/clubValidation";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Link } from "react-router-dom";
import { formatFile } from "../../../../utils/formatFile";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../../firebase";
import { toast } from "react-toastify";
import { Progress } from "../../../ui/progress";
import { Pencil } from "lucide-react";

// interface UpdateClubProps {
//     fecharModal: () => void;
//     handleUpdateClube: (data: Omit<IClube, 'id'>) => void;
//     club: IClube | null;
// }

// function UpdateClub({ fecharModal, handleUpdateClube, club }: UpdateClubProps) {
//     const { id } = useAuth();
//     const { register, handleSubmit, formState: { errors } } = useForm<Omit<IClube, 'id' | 'usuarioId'>>({
//         resolver: yupResolver(clubValidationSchema),
//     });

//     const onSubmit = (data: Omit<IClube, 'id' | 'usuarioId'>) => {
//         handleUpdateClube({ ...data, usuarioId: id });
//         fecharModal();
//     };

//     return (
//         <div className={styles.overlay}>
//             <div className={styles.updateClubModal}>
//                 <button type='button' onClick={() => fecharModal()}>FECHAR</button>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <p>Nome do Clube</p>
//                     <input type="text" {...register('nome')} defaultValue={club?.nome}/>
//                     {errors.nome && <p>{errors.nome.message}</p>}

//                     <p>Mascote</p>
//                     <input type="text" {...register('mascote')} defaultValue={club?.mascote}/>
//                     {errors.mascote && <p>{errors.mascote.message}</p>}

//                     <p>Cor principal</p>
//                     <input type="color" {...register('cor_principal')} defaultValue={club?.cor_principal}/>
//                     {errors.cor_principal && <p>{errors.cor_principal.message}</p>}

//                     <p>Cor secundária</p>
//                     <input type="color" {...register('cor_secundaria')} defaultValue={club?.cor_secundaria}/>
//                     {errors.cor_secundaria && <p>{errors.cor_secundaria.message}</p>}

//                     <button type="submit">Atualizar Clube</button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default UpdateClub;

interface UpdateClubProps {
    handleUpdateClube: (data: IClube) => void;
    clube: IClube;
}

function UpdateClub({ handleUpdateClube, clube }: UpdateClubProps) {
    const auth = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [promiseFoto, setPromiseFoto] = useState<FileInformation | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const form = useForm<Omit<IClube, 'id' | 'usuarioId'>>({
        resolver: yupResolver(clubValidationSchema),
        mode: 'onChange',
        defaultValues: {
            nome: clube.nome,
            cor_principal: clube.cor_principal,
            cor_secundaria: clube.cor_secundaria,
            mascote: clube.mascote,
            fotoUrl: clube.fotoUrl
        }
    });

    useEffect(() => {
        form.reset({
            nome: clube.nome,
            cor_principal: clube.cor_principal,
            cor_secundaria: clube.cor_secundaria,
            mascote: clube.mascote,
            fotoUrl: clube.fotoUrl
        });
        setPromiseFoto(null);
        setProgress(0);
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
                setProgress(0);

            }).catch((error) => {
                console.log(error + ": erro ao deletar");
                toast.error("Erro ao deletar")
            });
        }
    }

    const onSubmit: SubmitHandler<Omit<IClube, 'id' | 'usuarioId'>> = (data) => {
        handleUpdateClube({ ...data, id: clube.id, usuarioId: auth.id });
        setIsDialogOpen(false)
        form.reset();
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="cursor-pointer">
                    <Label className="cursor-pointer w-full flex justify-between items-center">Editar <Pencil /></Label>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atualizar clube</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                            <Button type="submit">Atualizar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateClub;