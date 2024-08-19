import { Paperclip, Copy, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";

interface CompartilharProps {
    id: number
}

export function Compartilhar({ id }: CompartilharProps) {
    const [copied, setCopied] = useState(false);

    const link = `http://localhost:5173/campeonato/${id}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent("Confira este campeonato: " + link)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' className='flex justify-between gap-2'>Compartilhar <Paperclip /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Compartilhar Campeonato</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <p>Copie o link abaixo para compartilhar:</p>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={link}
                            readOnly
                        />
                        <Button onClick={handleCopy} variant="outline">
                            {copied ? "Link Copiado!" : <><Copy className="mr-2" /> Copiar</>}
                        </Button>
                    </div>
                    <Button asChild variant="outline" className="flex items-center gap-2">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            <Send className="mr-2" /> Compartilhar no WhatsApp
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
