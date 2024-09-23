import { AlertDialogHeader } from "../../ui/alert-dialog";
import { Button } from "../../ui/button";
import { CardDescription } from "../../ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../ui/dialog";

function BePro() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="text-center w-full">
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <AlertDialogHeader>
                    <DialogTitle>Seja Pro</DialogTitle>
                    <CardDescription>
                        Tenha acesso a recursos exclusivos e suporte prioritário tornando-se um usuário Pro.
                    </CardDescription>
                </AlertDialogHeader>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <p>Assine o plano Pro por apenas R$9,90/mês e tenha:</p>
                        <ul className="list-disc ml-6">
                            <li>Funcionalidades avançadas</li>
                            <li>Suporte exclusivo 24/7</li>
                            <li>Atualizações antecipadas</li>
                            <li>Criação de copas</li>
                            <li>Sorteio automático dos jogos</li>
                        </ul>
                        <Button variant="default" className="mt-4 w-full">
                            Fazer upgrade agora
                        </Button>
                    </div>
                    <img className="max-sm:hidden w-[200px] h-[200px]" src="/champions-gaming1.png" alt="" />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default BePro;
