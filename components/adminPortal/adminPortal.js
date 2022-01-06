import { useEffect, useState } from 'react'
import ConsultationRequestViewer from '../consultationRequestViewer/consultationRequestViewer'
import ImagesEditor from '../imagesEditor/imagesEditor'
import LoginForm from '../loginForm/loginForm'
import PagesEditor from '../pagesEditor/pagesEditor'
import ServicesEditor from '../servicesEditor/servicesEditor'
import AccountsEditor from '../accountsEditor/accountsEditor'
import styles from './adminPortal.module.css'

export default function AdminPortal(){
  const [token, setToken] = useState(false)
  const [editor, setEditor] = useState('')

  return (<div className={styles.container}>
    {token ? <>
      <h1 className={styles.h1}>{editor ? editor : 'Admin portal'}</h1>
      {editor && <button className={styles.backBtn} onClick={_ => {setEditor('')}}>{'< Back to admin portal'}</button>}
      {!editor && <div className={styles.editorsList}>
        {['Services', 'Images', 'Pages', 'Consultation Requests', 'Accounts'].map((editorType, index) => {
          return (<button 
            className={styles.editorBtn} 
            key={index}
            onClick={_ => {setEditor(editorType)}}
          >{editorType}</button>)
        })}</div>
      }
      { editor === 'Services'
      ? <ServicesEditor token={token}/>
      : editor === 'Images'
      ? <ImagesEditor token={token}/>
      : editor === 'Pages'
      ? <PagesEditor token={token} />
      : editor === "Consultation Requests"
      ? <ConsultationRequestViewer token={token} />
      : editor === 'Accounts'
      ? <AccountsEditor token={token} />
      : <></>
      }
    </> : <LoginForm setToken={setToken} />}
  </div>)
}