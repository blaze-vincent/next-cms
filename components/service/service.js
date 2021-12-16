import { useEffect, useState } from 'react/cjs/react.development'
import styles from './service.module.css'

export default function Service({name, description, id}){
    const [preview, setPreview] = useState(null);
    useEffect(_ => {
        fetch('/api/imageService')
    })

    return (<div className={styles.container}>
        <h3>{name}</h3>
        <p>{description}</p>
    </div>)
}