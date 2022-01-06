import HomeDescriptionEditor from '../homeDescriptionEditor/homeDescriptionEditor'
import AboutEditor from '../aboutEditor/aboutEditor'
import styles from './pagesEditor.module.css'

export default function PagesEditor({token}){
  return (<div className={styles.container}>
    <HomeDescriptionEditor token={token} />
    <AboutEditor token={token} />
  </div>)
}