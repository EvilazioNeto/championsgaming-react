import { IJogador } from '../../../../interfaces/Jogador';
import styles from './ListPlayers.module.css';

interface ListPlayersProps {
    jogadores: IJogador[]
    fecharModal: () => void;
    selecionarJogador: (jogador: IJogador) => void;
}

function ListPlayers({ jogadores, fecharModal, selecionarJogador }: ListPlayersProps) {

    return (
        <div className={styles.overlay}>
            <div className={styles.listPlayersModal}>
                <button onClick={() => fecharModal()} type='button'>FECHAR</button>
                {jogadores.length > 0 ? (
                    jogadores.map((jogador) => (
                        <div onClick={() => selecionarJogador(jogador)} key={jogador.id} className={styles.jogadorBox}>
                            <p>{jogador.nome}</p>
                        </div>
                    ))
                ) : (
                    <div>
                        <h4>Nenhum jogador da posição encontrado</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListPlayers;