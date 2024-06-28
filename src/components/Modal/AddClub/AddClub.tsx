import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import styles from './AddClube.module.css';
import { IClube } from '../../../interfaces/Clube';
import { clubValidationSchema } from '../../../utils/clubValidation';
import { yupResolver } from '@hookform/resolvers/yup';

interface AddClubProps {
    fecharModal: () => void;
    handleAddClube: (data: Omit<IClube, 'id'>) => void;
}



function AddClub({ fecharModal, handleAddClube }: AddClubProps) {
    const { id } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<IClube, 'id' | 'usuarioId'>>({
        resolver: yupResolver(clubValidationSchema),
    });

    const onSubmit = (data: Omit<IClube, 'id' | 'usuarioId'>) => {
        handleAddClube({ ...data, usuarioId: id });
        fecharModal();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.addClubModal}>
                <button type='button' onClick={() => fecharModal()}>FECHAR</button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>Nome do Clube</p>
                    <input type="text" {...register('nome')} />
                    {errors.nome && <p>{errors.nome.message}</p>}

                    <p>Mascote</p>
                    <input type="text" {...register('mascote')} />
                    {errors.mascote && <p>{errors.mascote.message}</p>}

                    <p>Cor principal</p>
                    <input type="color" {...register('cor_principal')} />
                    {errors.cor_principal && <p>{errors.cor_principal.message}</p>}

                    <p>Cor secundária</p>
                    <input type="color" {...register('cor_secundaria')} />
                    {errors.cor_secundaria && <p>{errors.cor_secundaria.message}</p>}

                    <button type="submit">Adicionar Clube</button>
                </form>
            </div>
        </div>
    );
}

export default AddClub;
