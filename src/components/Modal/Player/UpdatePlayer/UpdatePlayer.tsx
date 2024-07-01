import { useForm } from 'react-hook-form';
import { IJogador } from '../../../../interfaces/Jogador';
import styles from './UpdatePlayer.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { IPosicao } from '../../../../interfaces/Posicao';
import { updatejogadorValidationSchema } from '../../../../utils/updateJogadorValidation';
import { obterPosicoes } from '../../../../services/player/playerService';

interface AddPlayerProps {
    fecharModal: () => void;
    handleUpdatePlayer: (data: Omit<IJogador, 'id' | 'clubeId'>) => void;
    player: IJogador | null
}

function UpdatePlayer({ fecharModal, handleUpdatePlayer, player }: AddPlayerProps) {
    const [posicoes, setPosicoes] = useState<IPosicao[]>([]);
    const [selectedPosicaoId, setSelectedPosicaoId] = useState<number | undefined>(player?.posicaoId);
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<IJogador, 'id' | 'clubeId'>>({
        resolver: yupResolver(updatejogadorValidationSchema),
    });

    useEffect(() => {
        obterPosicoes().then(data => {
            setPosicoes(data);
        });
    }, []);

    const onSubmit = (data: Omit<IJogador, 'id' | 'clubeId'>) => {
        handleUpdatePlayer(data);
        fecharModal();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.updatePlayerModal}>
                <button type='button' onClick={() => fecharModal()}>FECHAR</button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>Update player</h3>
                    <p>Nome do jogador</p>
                    <input type="text" {...register('nome')} defaultValue={player?.nome} />
                    {errors.nome && <p>{errors.nome.message}</p>}

                    <p>Posição do jogador</p>
                    <select
                        {...register('posicaoId')}
                        value={selectedPosicaoId}
                        onChange={(e) => setSelectedPosicaoId(Number(e.target.value))}
                    >
                        {posicoes.map((posicao) => (
                            <option key={posicao.id} value={posicao.id}>{posicao.nome}</option>
                        ))}
                    </select>


                    <p>Data de nascimento:</p>
                    <input
                        type="date"
                        {...register('dataNascimento')}
                        defaultValue={player?.dataNascimento.toString()}
                    />
                    <div className={styles.msgError}>{typeof errors.dataNascimento?.message === 'string' && errors.dataNascimento?.message}</div>

                    <p>Nacionalidade:</p>
                    <input
                        type="text"
                        {...register('nacionalidade')}
                        defaultValue={player?.nacionalidade}
                    />
                    {errors.nacionalidade && <p>{errors.nacionalidade.message}</p>}

                    <p>Numero da Camisa</p>
                    <input
                        type="number"
                        {...register('numeroCamisa')}
                        defaultValue={player?.numeroCamisa}
                    />

                    <button type="submit">Atualizar jogador</button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePlayer;
