import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol, faHome, faMoon, faPeopleGroup, faPlus, faTableList, faUser } from '@fortawesome/free-solid-svg-icons'

function Sidebar() {
    return (
        <aside className={`${styles.sidebar}`}>
            <div className={styles.optionsContainer}>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                            <FontAwesomeIcon icon={faHome} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/minhas-ligas">
                            Minhas Ligas
                            <FontAwesomeIcon icon={faTableList} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/criar-liga">
                            Criar nova liga
                            <FontAwesomeIcon icon={faPlus} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            Meus Clubes
                            <FontAwesomeIcon icon={faPeopleGroup} />
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            Artilheiros
                            <FontAwesomeIcon icon={faFutbol} />
                        </Link>
                    </li>
                </ul>
                <ul className={styles.settings}>
                    <li>
                        <Link to="/account">
                            Usuario
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                    </li>
                    <li>
                        Dark Mode
                        <FontAwesomeIcon icon={faMoon} />
                    </li>
                </ul>
            </div>
        </aside >
    )
}

export default Sidebar;
