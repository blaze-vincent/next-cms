import { useEffect, useState, useRef } from 'react'
import styles from './serviceEditable.module.css'

export default function ServiceEditable({serviceObj, flagStatusPrimary, flagSavable, flagForDeletion}){

  const [editMode, setEditMode] = useState(false);
  const [edited, setEdited] = useState(false);
  const [description, setDescription] = useState(serviceObj.description)
  const [secondaryStatus, setSecondaryStatus] = useState(serviceObj.secondaryStatus)
  const [name, setName] = useState(serviceObj.name)
  const [impedingError, setImpedingError] = useState(false);
  const [deleteConfirmations, setDeleteConfirmations] = useState(0);

  const checkPrimaryPrerequisites = function(primaryFlag){
    if(!secondaryStatus !== primaryFlag){
      if(!name || !description){
        setImpedingError(true);
      } else {
        setImpedingError(false);
        flagPrimaryLocal(primaryFlag)
      }
    }
  }

  const save = function(token, index, queueLength){
    const body = new FormData();

    body.append('origName', serviceObj.name);
    body.append('name', name);
    body.append('description', description);
    body.append('secondaryStatus', secondaryStatus);

    fetch('/api/service', {
      method: 'PUT',
      headers: new Headers({
        'authorization': token
      }),
      body
    }).then(async res => {
      const json = await res.json();
      //might add a display to show when a save was a success using index and queuelength
      //maybe
      console.log(json)
    })
  }
  
  useEffect(_ => {
    flagSavable(serviceObj._id, save, edited);
  }, [edited])

  const toggleEditMode = function(cancelFlag){
    if(cancelFlag === true){ //onClick passes an event
      setEdited(false);
      setDescription(serviceObj.description);
      setSecondaryStatus(serviceObj.secondaryStatus);
      flagStatusPrimary(serviceObj, !serviceObj.secondaryStatus);
      setName(serviceObj.name);
    } else if(editMode){ //finish changes was selected
      if(
        description !== serviceObj.description
      ||secondaryStatus !== serviceObj.secondaryStatus
      ||name !== serviceObj.name)
      {
        setEdited(true);
      } else {
        setEdited(false);
      }
    }
    setEditMode(!editMode);
  }

  const deleteService = function(){
    if(!deleteConfirmations){
      setDeleteConfirmations(deleteConfirmations + 1);
    } else {
      flagForDeletion(serviceObj._id)
    }
  }

  useEffect(_ => {
    const effect = setTimeout(_ => {deleteConfirmations && setDeleteConfirmations(deleteConfirmations - 1)}, 2000)
    return _ => { clearTimeout(effect) }
  })

  const flagPrimaryLocal = primaryStatus => {
    setSecondaryStatus(!primaryStatus)
    flagStatusPrimary(serviceObj, primaryStatus);
  }

  const textareaEl = useRef(null);
  useEffect(_ => {
    if(textareaEl.current){
      textareaEl.current.style.height = `${textareaEl.current.scrollHeight}px`
    }
  }, [description, editMode])

  return (<div className={styles.container}>
    <div className={styles.title}>
      { editMode
      ? <input className={`${styles.h2} ${styles.editMode}`} type='text' value={name} onChange={e => {setName(e.target.value)}} />
      : <span className={styles.span}>
          <h2 className={`${styles.h2} ${edited && styles.edited}`}>{name}</h2>
          <button className={styles.deleteBtn} onClick={deleteService}>
            {deleteConfirmations === 0 && 'delete' || deleteConfirmations === 1 && 'confirm deletion'}
          </button>
        </span>
      }
      <button className={styles.editBtn} onClick={toggleEditMode}>
        {editMode ? 'finish changes' : 'edit' }
      </button>
      {editMode && <button className={`${styles.editBtn} ${styles.cancelBtn}`} onClick={e => {toggleEditMode(true)}}>
        undo all changes
      </button>}
    </div>
    {editMode 
    ? <textarea 
        className={`${styles.textarea} ${styles.editMode}`} 
        ref={textareaEl} 
        type='textarea' 
        value={description}
        onChange={e => {setDescription(e.target.value)}}
      />
    : <p className={styles.p}>{description}</p>
    }{ editMode
    ?
    <>
    {impedingError && <p className={styles.impedingError}>You must fill out both the title and the description to mark this service as primary.</p>}

    <div className={styles.secondaryStatusSelection}>
        <p className={styles.displayPrompt}>Display this service on the home page? </p> 
        <button 
          onClick={e => {checkPrimaryPrerequisites(true)}} 
          className={`${styles.secondaryStatusBtn} ${!secondaryStatus && styles.selected}`}
          > Yes
        </button>
        <button 
          onClick={e => {checkPrimaryPrerequisites(false)}} 
          className={`${styles.secondaryStatusBtn} ${styles.secondaryStatusBtnNo} ${secondaryStatus && styles.selected}`}
          > No
        </button>
      </div></>
    : <p>This service <b className={styles.b}>is{secondaryStatus && ' not'}</b> displayed on the home page</p>
    }
  </div>)
}