import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampeonatoEstatisticas } from "../../../services/api/club/clubService";
import { IClubeCampeonato } from "../../../interfaces/ClubeCampeonato";

interface ITabelaProps extends IClubeCampeonato {
    pontos: number
}

function Tabela() {
    const { id } = useParams()
    const [clubsStas, setClubStats] = useState<ITabelaProps[]>([]);

    useEffect(() => {
        async function getData() {
            try {
                if (id) {
                    const idToNumber = parseInt(id)
                    const response = await getCampeonatoEstatisticas(idToNumber)

                    if (response instanceof Error) {
                        return;
                    } else {

                        const tabelaAtt = response.map((data) => {
                            return {
                                ...data,
                                pontos: (data.vitorias * 3) + (data.empates)
                            }
                        }).sort((a, b) => {
                            if (b.pontos !== a.pontos) {
                                return b.pontos - a.pontos;
                            } else {
                                return b.golsPro - a.golsPro;
                            }
                        });

                        setClubStats(tabelaAtt)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [id])

    useEffect(() => {
        console.log(clubsStas)
    }, [clubsStas])
    return (
        <main>

        </main>
    )
}

export default Tabela;
