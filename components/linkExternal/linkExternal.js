import styles from './linkExternal.module.css'

export default function LinkExternal({displayText = true, href, type, children}){
    return (<a href={href} className={styles.container}>
        <div className={styles.text}>
            {displayText && children}
            <div className={`${styles.externalIndicator} ${styles[type]}`} />
        </div>
    </a>)
}