import React from 'react'
import styles from './footerContentSection.module.css'

export default function FooterContentSection({children, title, alignCenter, spaceFiller}){
    return (<div className={`${styles.container} ${alignCenter && styles.alignCenter}`}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {spaceFiller ? <div className={styles.spaceFiller} /> 
        : React.Children.map(children, child => {
            return child.type ? <>{child}</> : <p>{child}</p>
        })}
    </div>)
}