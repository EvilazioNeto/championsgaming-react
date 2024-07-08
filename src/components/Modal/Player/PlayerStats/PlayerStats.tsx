import { useEffect, useState } from 'react';
import { IJogadorJogo } from '../../../../interfaces/JogadorJogo';
import styles from './PlayerStats.module.css';
import { obterJogadorPorId } from '../../../../services/player/playerService';
import { IJogador } from '../../../../interfaces/Jogador';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { jogadorJogoStatsValidationSchema } from '../../../../utils/jogadorJogoStatsValidation';

interface playerStatsProps {
    jogadorStats?: Omit<IJogadorJogo, 'id' | 'jogoId'>
    fecharModal: () => void;
    handleJogadorStats: (jogadorStats: Omit<IJogadorJogo, 'id' | 'jogoId'>) => void;
}

function PlayerStats({ fecharModal, jogadorStats, handleJogadorStats }: playerStatsProps) {
    const [jogador, setJogador] = useState<IJogador | Error>();
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<IJogadorJogo, 'id' | 'jogadorId' | 'jogoId'>>({
        resolver: yupResolver(jogadorJogoStatsValidationSchema),
    });


    const onSubmit = (data: Omit<IJogadorJogo, 'id' | 'jogoId' | 'jogadorId'>) => {
        if (jogadorStats) {
            handleJogadorStats({ ...data, jogadorId: jogadorStats.jogadorId });
            fecharModal();
        }
    };

    useEffect(() => {
        async function obterJogador() {
            if (jogadorStats) {
                const jogadorSelec = await obterJogadorPorId(jogadorStats.jogadorId)
                if (jogador instanceof Error) {
                    return;
                } else {
                    setJogador(jogadorSelec)
                }
            }
        }
        obterJogador()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jogadorStats])

    return (
        <div className={styles.overlay}>
            <div className={styles.playerStatsModal}>
                <button onClick={() => fecharModal()} type='button'>FECHAR</button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {jogador instanceof Error ? (
                        <h2>Erro ao buscar dados do jogador</h2>
                    ) : (
                        <h2>{jogador?.nome} - {jogador?.numeroCamisa}</h2>
                    )}
                    <p>Gols</p>
                    <input
                        type="number"
                        min={0}
                        defaultValue={jogadorStats?.gols}
                        {...register('gols')}
                    />
                    {errors.gols && <p>{errors.gols.message}</p>}
                    <p>Assistências</p>
                    <input
                        type="number"
                        min={0}
                        defaultValue={jogadorStats?.assistencias}
                        {...register('assistencias')}
                    />
                    {errors.assistencias && <p>{errors.assistencias.message}</p>}
                    <p>Cartão Amarelo</p>
                    <input
                        type="number"
                        max={2}
                        min={0}
                        maxLength={2}
                        defaultValue={jogadorStats?.cartaoAmarelo}
                        {...register('cartaoAmarelo')}
                    />
                    {errors.cartaoAmarelo && <p>{errors.cartaoAmarelo.message}</p>}
                    <p>Cartão Vermelho</p>
                    <input
                        type="number"
                        max={1}
                        min={0}
                        defaultValue={jogadorStats?.cartaoVermelho}
                        {...register('cartaoVermelho')}
                    />
                    {errors.cartaoVermelho && <p>{errors.cartaoVermelho.message}</p>}
                    <button>ATUALIZAR</button>
                </form>
            </div>
        </div>
    )
}

export default PlayerStats;
