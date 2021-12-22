import styles from './consultationRequest.module.css'
import {useState, useEffect} from 'react';

export default function ConsultationRequest({request, token, refresh}){
  
  const {
    _id,
    name,
    email,
    phone,
    zipcode,
    comment,
    services,
    createdAt
  } = request;

  const date = new String(new Date(createdAt))
  .replace('GMT-0600 (Central Standard Time)', '')
  .split(' ').slice(1).join(' ')
  .split(':').slice(0,-1).join(":")


  const [deleteTaps, setDeleteTaps] = useState(0)
  useEffect(_ => {
    if(deleteTaps > 1){
      fetch(`/api/consultation/${_id}`, {
        method: 'DELETE',
        headers: new Headers({
          'authorization': token
        }),
      }).then(async res => {
        const json = await res.json();
        if(json.consultationRequest){
          refresh(json.consultationRequest)
        }
      })
    }

    const effect = setTimeout(_ => {
      if(deleteTaps){
        setDeleteTaps(deleteTaps - 1);
      }
    }, 1000)
    return _ => {
      clearTimeout(effect)
    }
  }, [deleteTaps])

  return (<div className={styles.container}>
    
    <div className={styles.horizontalContainer}>
      <h3>{date}</h3>
      <button
        onClick={e => {
          setDeleteTaps(deleteTaps + 1)
        }}
        className={styles.deleteButton}
      >{
       deleteTaps
       && 'confirm'
       || 'delete' 
      }</button>
    </div>
    <div className={styles.horizontalContainer}>
      <p>name: </p>
      <b>{name}</b>
    </div>
    <div className={styles.horizontalContainer}>
      <p>phone number:</p>
      <a href={`tel:${phone}`}><b>{phone}</b></a>
    </div>
    <div className={styles.horizontalContainer}>
      <p>email address: </p>
      <a href={`mailto:${email}`}><b>{email}</b></a>
    </div>
    <div className={styles.horizontalContainer}>
      <p>zipcode: </p>
      <b>{zipcode}</b>
    </div>
    <div className={styles.horizontalContainer}>
      <p>services desired: </p>
      <b>{services.join(', ')}</b>
    </div>
    <p>they left the following message: {comment}</p>
    
  </div>)
}