import ImagesEditor from "../components/imagesEditor/imagesEditor";
import styles from './page.module.css'

export default function Gallery(){
    return (<div className={styles.container}>
      <br></br>
      <h1 className={styles.h1}>Gallery</h1>
      <ImagesEditor />
    </div>)
}