import { toast } from "react-toastify";
import { Api } from "../api/axios-config";
import { IJogador } from "../../interfaces/Jogador";

export async function obterPosicoes() {
    try {
        const response = await Api.get("/posicoes");
        return response.data;
    } catch (error) {
        console.log(error)
        toast.error('Erro ao obter posições')
    }
}

export async function criarJogador(jogador: Omit<IJogador, 'id'>): Promise<number | Error> {
    try {
        const response = await Api.post("/jogadores", jogador)
        if (response.status === 201) {
            toast.success("Jogador criado com sucesso")
            return response.data;
        } else {
            return new Error('Erro inesperado ao criar jogador');
        }
    } catch (error) {
        console.log(error);
        toast.error("Erro ao criar jogador");
        return new Error('Erro inesperado ao criar jogador');
    }
}

export async function obterJogadorPorId(id: number): Promise<IJogador | Error> {
    try {
        const response = await Api.get<IJogador>(`/jogadores/${id}`);
        if (response.status === 201) {
            return response.data;
        } else {
            return new Error('Erro inesperado ao obter jogador');
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao obter jogador");
        return new Error('Erro ao obter jogador');
    }
}

export async function deletarJogadorPorId(id: number): Promise<void | Error> {
    try {
        const response = await Api.delete<IJogador>(`/jogadores/${id}`);
        if (response.status === 200) {
            toast.success(`jogador deletado com sucesso`);
            return;
        } else {
            return new Error('Erro inesperado ao deletar jogador');
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar jogador");
        return new Error('Erro ao deletar jogador');
    }
}

export async function atualizarJogadorPorId(id: number, jogador: Omit<IJogador, 'id' | 'clubeId'>): Promise<void | Error> {
    try {
        const response = await Api.put(`/jogadores/${id}`, jogador);

        if (response.status === 200) {
            toast.success("Jogador atualizado")
        } else {
            return new Error('Erro ao atualizar jogador');
        }

    } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar jogador");
        return new Error('Erro ao atualizar jogador');
    }
}

export async function obterJogadoresDoClubePorId(id: number): Promise<IJogador[] | Error>{
    try {
        const response = await Api.get(`/clubes/${id}/jogadores`)
        if (response.status === 200) {
            return response.data;
        }else{
            return new Error("Erro ao obter jogadores do clube");
        }

    } catch (error) {
        toast.error("Erro ao obter jogadores")
        console.log(error)
        return new Error("Erro ao obter jogadores do clube")
    }
}