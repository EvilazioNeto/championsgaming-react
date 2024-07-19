import { IPosicao } from "../../interfaces/Posicao";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface PosicaoProps {
    posicoes: IPosicao[]
}

export function SelectPosicao({ posicoes }: PosicaoProps) {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Posições" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {posicoes.map((posicao) => (
                        <SelectItem key={posicao.id} value={posicao.id}>{posicao.nome}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
