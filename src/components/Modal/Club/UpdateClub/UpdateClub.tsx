import { useForm } from 'react-hook-form';
import { useAuth } from '../../../../contexts/AuthProvider/useAuth';
import styles from './UpdateClub.module.css';
import { IClube } from '../../../../interfaces/Clube';
import { clubValidationSchema } from '../../../../utils/clubValidation';
import { yupResolver } from '@hookform/resolvers/yup';

interface UpdateClubProps {
    fecharModal: () => void;
    handleUpdateClube: (data: Omit<IClube, 'id'>) => void;
    club: IClube | null;
}

function UpdateClub({ fecharModal, handleUpdateClube, club }: UpdateClubProps) {
    const { id } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<Omit<IClube, 'id' | 'usuarioId'>>({
        resolver: yupResolver(clubValidationSchema),
    });

    const onSubmit = (data: Omit<IClube, 'id' | 'usuarioId'>) => {
        handleUpdateClube({ ...data, usuarioId: id });
        fecharModal();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.updateClubModal}>
                <button type='button' onClick={() => fecharModal()}>FECHAR</button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>Nome do Clube</p>
                    <input type="text" {...register('nome')} defaultValue={club?.nome}/>
                    {errors.nome && <p>{errors.nome.message}</p>}

                    <p>Mascote</p>
                    <input type="text" {...register('mascote')} defaultValue={club?.mascote}/>
                    {errors.mascote && <p>{errors.mascote.message}</p>}

                    <p>Cor principal</p>
                    <input type="color" {...register('cor_principal')} defaultValue={club?.cor_principal}/>
                    {errors.cor_principal && <p>{errors.cor_principal.message}</p>}

                    <p>Cor secundária</p>
                    <input type="color" {...register('cor_secundaria')} defaultValue={club?.cor_secundaria}/>
                    {errors.cor_secundaria && <p>{errors.cor_secundaria.message}</p>}

                    <button type="submit">Atualizar Clube</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateClub;
