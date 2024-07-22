import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { IJogadorJogo } from "../../../../interfaces/JogadorJogo";
import { IJogador } from "../../../../interfaces/Jogador";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jogadorJogoStatsValidationSchema } from "../../../../utils/jogadorJogoStatsValidation";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";

interface playerStatsProps {
    jogadorStats?: Omit<IJogadorJogo, 'id' | 'jogoId'>
    jogador: IJogador;
    handleJogadorStats: (jogadorStats: Omit<IJogadorJogo, 'id' | 'jogoId'>) => void;
    selecionarJogadorStats: () => void;
}

function PlayerStats({ handleJogadorStats, selecionarJogadorStats, jogadorStats, jogador }: playerStatsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const form = useForm<Omit<IJogadorJogo, 'id' | 'jogadorId' | 'jogoId'>>({
        resolver: yupResolver(jogadorJogoStatsValidationSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (jogadorStats) {
            form.reset({
                assistencias: jogadorStats.assistencias,
                cartaoAmarelo: jogadorStats.cartaoAmarelo,
                cartaoVermelho: jogadorStats.cartaoVermelho,
                gols: jogadorStats.gols
            });
        }
    }, [jogadorStats, form]);

    const onSubmit = (data: Omit<IJogadorJogo, 'id' | 'jogoId' | 'jogadorId'>) => {
        if (jogadorStats) {
            handleJogadorStats({ ...data, jogadorId: jogadorStats.jogadorId });
            setIsDialogOpen(false)
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
            <DialogTrigger asChild>
                <FontAwesomeIcon onClick={selecionarJogadorStats} icon={faUserEdit} className="text-black cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{jogador.nome}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="gols" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gols</FormLabel>
                                <FormControl>
                                    <Input min={0} type="number" placeholder="Gols do jogador" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="assistencias" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assistências</FormLabel>
                                <FormControl>
                                    <Input min={0} type="number" placeholder="Assistências do jogador" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cartaoAmarelo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cartão Amarelo</FormLabel>
                                <FormControl>
                                    <Input min={0} type="number" {...field} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cartaoVermelho" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cartão Vermelho</FormLabel>
                                <FormControl>
                                    <Input min={0} type="number" {...field} />
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
    );
}

export default PlayerStats;