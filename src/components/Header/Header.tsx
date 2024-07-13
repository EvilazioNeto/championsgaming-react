import { Link } from "react-router-dom";
import styles from './Header.module.css';
import { ModeToggle } from "../mode-toggle";

function Header() {
    return (
        <header>
            <div className={styles.divLogo}>
                <Link to="/">
                    <img className={styles.logo} src="/logo.png" alt="" />
                    <h2>TORNEIO MASTER</h2>
                </Link>
            </div>
            <div className={styles.navbar}>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/criar-liga">
                            Criar liga
                        </Link>
                    </li>
                    <li>
                        <Link to="/minhas-ligas">
                            Minhas ligas
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            Usuario
                        </Link>
                    </li>
                    <ModeToggle />
                </ul>
            </div>
            {/* <div className={styles.userImgBox}>
                <Link to="/account">
                    <img className={styles.userImg} src={logoUser} alt="" />
                </Link>
            </div> */}
        </header>
    )
}

export default Header;
