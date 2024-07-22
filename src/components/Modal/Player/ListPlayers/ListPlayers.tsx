import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IJogador } from "../../../../interfaces/Jogador";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Label } from "../../../ui/label";

interface ListPlayersProps {
    jogadores: IJogador[];
    selecionarJogador: (jogador: IJogador) => void;
}

function ListPlayers({ jogadores, selecionarJogador }: ListPlayersProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <FontAwesomeIcon icon={faAdd} className="text-black cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Selecionar Jogador</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {jogadores.length > 0 ? (
                        jogadores.map((jogador) => (
                            <div
                                className="transition-colors duration-150 rounded-lg p-2 text-center 
                                           cursor-pointer border border-sky-500 hover:bg-slate-200 dark:hover:bg-gray-700
                                         hover:text-black dark:hover:text-white dark:text-gray-300"
                                onClick={() => selecionarJogador(jogador)} key={jogador.id} >
                                <Label className="cursor-pointer">{jogador.nome}</Label>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h4 className="text-black text-center dark:text-white">Nenhum jogador da posição encontrado</h4>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ListPlayers;