import { useState, useEffect, useRef } from 'react';
import styles from './homeDescriptionEditor.module.css'

export default function HomeDescriptionEditor({token}){

  const [description, setDescription] = useState('');
  const previousDescription = useRef('');
  const [editSaved, setEditSaved] = useState(false);
  const textareaEl = useRef(null)

  useEffect(_ => {
    if(editSaved){
      previousDescription.current = description;
    }
    const effect = setTimeout(_ => {
      if(editSaved){
        setEditSaved(false)
      }
    }, 2000)
    return _ => {
      clearTimeout(effect)
    }
  }, [editSaved])

  useEffect(_ => {
    fetch('/api/homedescription').then(async res => {
      const json = await res.json();
      if(json.dbDescription){
        setDescription(json.dbDescription.paragraph);
        previousDescription.current = json.dbDescription.paragraph;
        if(textareaEl.current){
          textareaEl.current.style.height = `${textareaEl.current.scrollHeight + 5}px`
        }
      }
    })
  }, [])

  return (<div className={styles.container}>
    <h2 className={styles.h2}>Home</h2>
    <label htmlFor="paragraph">{
      editSaved 
      && "Changes saved..."
      || "Type a description for the Home page here."
    }</label>
    <textarea 
      name="paragraph"
      value={description}
      ref={textareaEl}
      cols={28}
      onChange={e => {
        e.target.style.height = `${e.target.scrollHeight + 4}px`;
        setDescription(e.target.value)
      }}  
    />
    <div className={styles.horizontalContainer}>
      <button 
        className={styles.saveButton}
        onClick={e => {
          const body = new FormData()
          body.append('paragraph', description);
          fetch('/api/homedescription', {
            method: 'POST',
            headers: new Headers({
              "authorization": token
            }),
            body
          }).then(async res => {
            const json = await res.json();
            if(json.dbDescription){
              setEditSaved(true)
            }
          })
        }}  
      >
        save
      </button>
      <button 
        className={styles.cancelButton}
        onClick={_ => {
          setDescription(previousDescription.current)
        }}
      >
        cancel
      </button>
    </div>
  </div>)
}