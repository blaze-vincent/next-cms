import PillButton from '../pillButton/pillButton';
import styles from './aboutPreview.module.css';
import { useEffect, useRef } from 'react';

export default function AboutPreview({paragraph, backgroundImage}){

  const backgroundEl = useRef(null);

  useEffect(_ => {
    if(backgroundImage){
      if(backgroundEl.current){
        backgroundEl.current.style.backgroundImage = `url(${backgroundImage.url})`
      }
    }
  }, [backgroundImage])
  
  return (<div className={styles.container}>
    <div ref={backgroundEl} className={styles.background} />
    <div className={styles.overlay}>
      <div className={styles.subContainer}>
        <h2 className={styles.h2}>Precision Coatings</h2>
        <h1 className={styles.h1}>Southeast Iowa Painting Contractors</h1>
      </div>
      <div className={styles.subContainer}>
        <p className={styles.p}>
          {paragraph}
        </p>
        <PillButton destination="/about" size="small">Read more about us</PillButton>
      </div>
    </div>
  </div>)
}