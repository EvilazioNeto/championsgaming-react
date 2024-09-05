import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { useEffect } from "react";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "../../../ui/hover-card";

interface IjogadorStatsProps {
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    gols: number;
    jogadorId: number;
    nome: string;
    fotoUrl: string;
}

interface PlayerInfoProps {
    jogador: IjogadorStatsProps
}

function PlayerInfo({ jogador }: PlayerInfoProps) {

    useEffect(() => {
        console.log(jogador)
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary'>Detalhes</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Estatísticas do jogador</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4">
                    <img className="aspect-square rounded-md object-cover w-[200px] h-[200px]" src={jogador.fotoUrl} alt="" />
                    <div className="w-full flex flex-col gap-2">
                        <h2 className="text-2xl text-center">{jogador.nome}</h2>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full flex justify-around">
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[15px] rounded" src="https://static.vecteezy.com/system/resources/thumbnails/021/888/083/small_2x/3d-soccer-ball-or-football-png.png" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Gols</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.gols}</p>
                                </div>
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[15px] rounded" src="https://static.vecteezy.com/system/resources/thumbnails/021/888/083/small_2x/3d-soccer-ball-or-football-png.png" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Assistências</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.assistencias}</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-around">
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[15px] rounded" src="https://img2.gratispng.com/20180325/vdw/kisspng-penalty-card-yellow-card-association-football-refe-sim-cards-5ab74207cf9f95.5798399315219594318504.jpg" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Cartões Amarelos</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.cartoesAmarelos}</p>
                                </div>
                                <div className="flex gap-1">
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <img className="w-[15px] rounded" src="https://m.media-amazon.com/images/I/51hvmeVHvgL._AC_UF894,1000_QL80_.jpg" alt="" />
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-min">
                                            <p className="whitespace-nowrap">Cartões Vermelhos</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                    <p>- {jogador.cartoesVermelhos}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PlayerInfo;