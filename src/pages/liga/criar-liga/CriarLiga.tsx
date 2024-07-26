import { useState } from 'react';
import styles from './CriarLiga.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campeonatoValidationSchema } from '../../../utils/campeonatoValidation';
import { ICampeonato } from '../../../interfaces/Campeonato';
import { formatToDate } from '../../../utils/formatToDate';
import { useAuth } from '../../../contexts/AuthProvider/useAuth';
import { Api } from '../../../services/api/axios-config';
import { toast } from 'react-toastify';
import { Input } from '../../../components/ui/input';
import { DatePickerWithRange } from '../../../components/DatePicker/DatePickerWithRange';
import { Button } from '../../../components/ui/button';
import logo from "/logo-sem-fundo.png"

interface DateProps {
    dataInicio: Date,
    dataFim: Date
}

function CriarLiga() {
    const { id } = useAuth();
    const [dataInicio, setDataInicio] = useState<string>()
    const [dataFim, setDataFim] = useState<string>()
    const [btnSelected, setBtnSelected] = useState<number>(4);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<ICampeonato, 'id' | 'usuarioId' | 'status' | 'numeroRodadas' | 'quantidadeTimes' | 'dataInicio' | 'dataFim'>>({
        resolver: yupResolver(campeonatoValidationSchema)
    })

    async function onSubmit(data: Omit<ICampeonato, 'id' | 'usuarioId' | 'status' | 'numeroRodadas' | 'quantidadeTimes' | 'dataInicio' | 'dataFim'>) {
        const rodadas = 2 * (btnSelected - 1);
        const dados = {
            dataFim: dataFim,
            dataInicio: dataInicio,
            usuarioId: id,
            nome: data.nome,
            status: 'ativo',
            numeroRodadas: rodadas,
            quantidadeTimes: btnSelected,
            fotoUrl: "https://image-service.onefootball.com/transform?w=256&dpr=2&image=https://images.onefootball.com/icons/leagueColoredCompetition/128/9.png"
        }
    
        try {
            const response = await Api.post("/campeonatos", dados)

            if (response.status === 201) {
                toast.success('Liga criada com sucesso')
                reset();
            }
        } catch (error) {
            console.log(error)
            toast.error('Erro ao criar liga')
        }

    }

    function onDateChange(e: DateProps) {
        setDataInicio(formatToDate(e.dataInicio))
        setDataFim(formatToDate(e.dataFim))
    }

    return (
        <>
            <main className={styles.mainCriarLiga}>
                <section className={styles.formSection}>
                    <form className={styles.formCriarLiga} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formApresentacao}>
                            <img src={logo} alt="" />
                            <h2>Crie sua Liga de Futebol!</h2>
                        </div>
                        <div>
                            <p>Nome da Liga</p>
                            <Input
                                type="text"
                                {...register('nome')}
                            />
                            <div className={styles.msgError}>{errors.nome?.message}</div>
                        </div>
                        <div className={styles.dataLiga}>
                            <DatePickerWithRange onDateChange={onDateChange} />
                        </div>
                        <div className={styles.qtdTimesContainer}>
                            <p>Quantidade de times</p>
                            <div className={styles.boxQtd}>
                                <div className={btnSelected === 4 ? styles.selected : ''} onClick={() => setBtnSelected(4)}>4</div>
                                <div className={btnSelected === 6 ? styles.selected : ''} onClick={() => setBtnSelected(6)}>6</div>
                                <div className={btnSelected === 8 ? styles.selected : ''} onClick={() => setBtnSelected(8)}>8</div>
                                <div className={btnSelected === 10 ? styles.selected : ''} onClick={() => setBtnSelected(10)}>10</div>
                                <div className={btnSelected === 12 ? styles.selected : ''} onClick={() => setBtnSelected(12)}>12</div>
                                <div className={btnSelected === 14 ? styles.selected : ''} onClick={() => setBtnSelected(14)}>14</div>
                                <div className={btnSelected === 16 ? styles.selected : ''} onClick={() => setBtnSelected(16)}>16</div>
                                <div className={btnSelected === 18 ? styles.selected : ''} onClick={() => setBtnSelected(18)}>18</div>
                                <div className={btnSelected === 20 ? styles.selected : ''} onClick={() => setBtnSelected(20)}>20</div>
                            </div>
                        </div>

                        <Button type='submit' className={styles.btnCriarLiga}>Criar Liga</Button>
                    </form>

                </section>
            </main>
        </>
    )
}

export default CriarLiga;
