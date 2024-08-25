import { toast } from "react-toastify";
import { ICampeonato } from "../../interfaces/Campeonato";
import { Api } from "../api/axios-config";

export async function obterCampeonatoPorId(id: number): Promise<ICampeonato | Error> {
    try {
        const response = await Api.get<ICampeonato>(`/campeonatos/${id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            return new Error('Erro inesperado ao obter campeonato');
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao obter campeonato");
        return new Error('Erro ao obter campeonato');
    }
}