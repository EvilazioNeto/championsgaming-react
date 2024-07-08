import { Link } from "react-router-dom";
import styles from './Header.module.css';
import logoUser from '/user.png'

function Header() {
    return (
        <header>
            <div className={styles.divLogo}>
                <Link to="/">
                    <img className={styles.logo} src="/logo.png" alt="" />
                    <h2>TORNEIO MASTER</h2>
                </Link>
            </div>
            <div className={styles.searchBox}>
                <select name="" id="">
                    <option value="">São Paulo, Brasil</option>
                    <option value="">Sergipe, Brasil</option>
                    <option value="">Bahia, Brasil</option>
                    <option value="">Minas Gerais, Brasil</option>
                </select> 
                <input type="text" placeholder='Search' />
                <button>SEARCH</button>
            </div>
            <div className={styles.userImgBox}>
                <Link to="/account">
                    <img className={styles.userImg} src={logoUser} alt="" />
                </Link>
            </div>
        </header>
    )
}

export default Header;
