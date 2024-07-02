import { toast } from "react-toastify";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";
import { Api } from "../axios-config";
import { IClube } from "../../../interfaces/Clube";

export async function getCampeonatoEstatisticas(id: number): Promise<IClubeCampeonato[] | Error> {
    try {
        const response = await Api.get(`/campeonatos/${id}/clubes`);

        if (response.status === 200) {
            return response.data;
        } else {
            toast.error("Erro ao obter informação dos clubes no campeonato")
            return new Error('Erro inesperado ao obter informação dos clubes no campeonato');
        }
    } catch (error) {
        console.log(error)
        return new Error('Erro inesperado ao obter informação dos clubes no campeonato');
    }
}

export async function criarClubeCampeonatoEstatisticas(data: Omit<IClubeCampeonato, 'id'>): Promise<number | Error> {
    try {
        const response = await Api.post(`/clubes-campeonatos`, data);

        if (response.status === 201) {
            toast.success("Adicionado na liga");
            return response.data;
        } else {
            toast.error("Erro ao adicionar clube na liga")
            return new Error('Erro inesperado ao adicionar informação do clube no campeonato');
        }
    } catch (error) {
        toast.error("Erro ao adicionar clube na liga")
        console.log(error)
        return new Error('Erro inesperado ao adicionar informação do clube no campeonato');
    }
}

export async function deletarCampeonatoClubeEstatisticas(id: number): Promise<void | Error> {
    try {
        const response = await Api.delete(`/clubes-campeonatos/${id}`)

        if (response.status === 200) {
            toast.success("Clube excluido da tabela")
            return;
        } else {
            toast.error("Erro ao deletar informação do clube no campeonato")
            return new Error('Erro inesperado ao obter informação do clube no campeonato');
        }
    } catch (error) {
        toast.error("Erro ao deletar informação do clube no campeonato")
        console.log(error)
        return new Error('Erro inesperado ao obter informação do clubes no campeonato');
    }
}

export async function deletarClubePorId(id: number): Promise<void | Error> {
    try {
        const response = await Api.delete<IClube>(`/clubes/${id}`);
        if (response.status === 204) {
            toast.success(`clube deletado com sucesso`);
            return;
        } else {
            return new Error('Erro inesperado ao deletar clube');
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar clube");
        return new Error('Erro ao deletar clube');
    }
}

export async function criarClube(clube: Omit<IClube, 'id'>): Promise<number | Error> {
    try {
        const response = await Api.post("/clubes", clube)
        if (response.status === 201) {
            toast.success("clube criado com sucesso")
            return response.data;
        } else {
            return new Error('Erro inesperado ao criar clube');
        }
    } catch (error) {
        console.log(error);
        toast.error("Erro ao criar clube");
        return new Error('Erro inesperado ao criar clube');
    }
}