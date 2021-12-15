import styles from './widthContainer.module.css'
export default function WidthContainer({children}){
    return (<div className={styles.container}>
        <div className={styles.widthContainer}>
            {children}
        </div>
    </div>)
}