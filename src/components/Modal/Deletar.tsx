import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeletarItemProps{
    itemExcluido: string
    deletarItem: () => void;
}

export function DeletarItemModal({itemExcluido, deletarItem}: DeletarItemProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <FontAwesomeIcon icon={faTrash}/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
                        Isso excluirá permanentemente: {itemExcluido}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={deletarItem}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
