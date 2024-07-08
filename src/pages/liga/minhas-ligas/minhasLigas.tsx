import { useEffect, useState } from 'react';
import styles from './minhasLigas.module.css';
import { Api } from '../../../services/api/axios-config';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function MinhasLigas() {
    const auth = useAuth();
    const [campeonatos, setCampeonatos] = useState<ICampeonato[]>([])

    useEffect(() => {
        async function obterCampeonatos() {
            try {
                const response = await Api.get(`/usuario/${auth.id}/campeonatos`)

                if (response.status === 200) {
                    setCampeonatos(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao buscar os campeonatos')
            }
        }
        obterCampeonatos();
    }, [auth.id]);

    async function deletarPorId(campeonato: ICampeonato) {
        const confirmar = confirm(`Deseja deletar ${campeonato.nome}?`)

        if (confirmar) {
            try {
                const response = await Api.delete(`/campeonatos/${campeonato.id}`)
                if (response.status === 200) {
                    toast.success('Liga deletada com sucesso')

                    const index = campeonatos.indexOf(campeonato);
                    campeonatos.splice(index, 1)
                    setCampeonatos([...campeonatos]);
                }
            } catch (error) {
                console.log(error)
                toast.error('Erro ao deletar o campeonato')
            }
        }
    }

    return (
        <main className={styles.minhasLigasContainer}>
            <h1>Minhas Ligas</h1>
            <ul>
                {campeonatos.map((campeonato, i) => (
                    <li key={campeonato.id}>
                        <Link key={campeonato.id} to={`${campeonato.id}`}>
                            {campeonato.nome}
                        </Link>
                        <FontAwesomeIcon  key={i} icon={faTrash} onClick={() => deletarPorId(campeonato)} />
                    </li>
                ))}
            </ul>
        </main>
    )
}