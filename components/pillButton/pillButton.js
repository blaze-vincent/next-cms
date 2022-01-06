import styles from './pillButton.module.css'
import Link from 'next/link'

export default function PillButton({size, children, destination, clickHandler}){
    return (<Link passHref={true} href={destination}>
        <button 
            className={`${styles.container} ${styles[size]}`}
            onClick={clickHandler}    
        >
            {children}
        </button>
    </Link>)
}