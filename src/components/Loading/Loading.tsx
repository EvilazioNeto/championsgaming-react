import styles from './Loading.module.css';
import gifbola from "/gifbola.gif"

function Loading(){
    return(
        <div className={styles.overlay}>
            <div className={styles.loadingContainer}>
                <img src={gifbola} alt="loading" />
                <h2>Loading...</h2>
            </div>
        </div>
    )
}

export default Loading;
