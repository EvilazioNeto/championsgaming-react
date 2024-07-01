import { useForm } from 'react-hook-form';
import { IJogador } from '../../../../interfaces/Jogador';
import styles from './AddPlayer.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { jogadorValidationSchema } from '../../../../utils/jogadorValidation';
import { useEffect, useState } from 'react';
import { IPosicao } from '../../../../interfaces/Posicao';
import { obterPosicoes } from '../../../../services/player/playerService';

interface AddPlayerProps {
    fecharModal: () => void;
    handleAddPlayer: (data: Omit<IJogador, 'id'>) => void;
    clubeId: number | undefined
}

function AddPlayer({ fecharModal, handleAddPlayer, clubeId }: AddPlayerProps) {
    const [posicoes, setPosicoes] = useState<IPosicao[]>([])
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<IJogador, 'id' | 'clubeId'>>({
        resolver: yupResolver(jogadorValidationSchema),
    });

    useEffect(() => {
        obterPosicoes().then(data => {
            setPosicoes(data);
        });
    }, []);

    const onSubmit = (data: Omit<IJogador, 'id' | 'clubeId'>) => {
        if (clubeId) {
            handleAddPlayer({ ...data, clubeId: clubeId });
            fecharModal();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.addPlayerModal}>
                <button type='button' onClick={() => fecharModal()}>FECHAR</button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>Add player</h3>
                    <p>Nome do jogador</p>
                    <input type="text" {...register('nome')} />
                    {errors.nome && <p>{errors.nome.message}</p>}

                    <p>Posição do jogador</p>
                    <select {...register('posicaoId')}>
                        {posicoes.map((posicao) => (
                            <option key={posicao.id} value={posicao.id}>{posicao.nome}</option>
                        ))}
                    </select>

                    <p>Data de nascimento:</p>
                    <input
                        type="date"
                        {...register('dataNascimento')}
                    />
                    <div className={styles.msgError}>{typeof errors.dataNascimento?.message === 'string' && errors.dataNascimento?.message}</div>

                    <p>Nacionalidade:</p>
                    <input
                        type="text"
                        {...register('nacionalidade')}
                    />
                    {errors.nacionalidade && <p>{errors.nacionalidade.message}</p>}

                    <p>Numero da Camisa</p>
                    <input
                        type="number"
                        {...register('numeroCamisa')}
                    />

                    <button type="submit">Adicionar jogador</button>
                </form>
            </div>
        </div>
    )
}

export default AddPlayer;
