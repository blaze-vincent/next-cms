import AboutEditor from '../aboutEditor/aboutEditor'
import styles from './pagesEditor.module.css'

export default function PagesEditor({token}){
  return (<div className={styles.container}>
    <AboutEditor token={token} />
  </div>)
}