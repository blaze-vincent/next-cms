import PillButton from '../pillButton/pillButton';
import styles from './aboutPreview.module.css';

export default function AboutPreview(){
  return (<div className={styles.container}>
    <div className={styles.background} />
    <div className={styles.overlay}>
      <div className={styles.subContainer}>
        <h2 className={styles.h2}>Precision Coatings</h2>
        <h1 className={styles.h1}>Southeast Iowa Painting Contractors</h1>
      </div>
      <div className={styles.subContainer}>
        <p className={styles.p}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae tellus eu lorem vulputate auctor eget sit amet lacus. Donec imperdiet enim et turpis finibus elementum. Nullam id odio in nunc porttitor egestas sit amet eget erat.
        </p>
        <PillButton destination="/about" size="small">Read more about us</PillButton>
      </div>
    </div>
  </div>)
}