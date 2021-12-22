import { useEffect, useState } from 'react';
import styles from './servicesChecklistInput.module.css';

export default function ServicesChecklistInput({value, setter}){

  const [services, setServices] = useState([]);
  useEffect(_ => {
    fetch('/api/service').then(async res => {
      const json = await res.json()
      setServices(json.services)
    })
  }, [])

  const changeHandler = e => {
    if(e.target.checked){
      setter(value.concat(e.target.value))
    } else {
      setter(value.filter(item => item !== e.target.value))
    }
  } 

  return (<div className={styles.container}>
    {services && services.map((svc, index) => {
      return (<div key={index} className={styles.inputContainer}>
        <label htmlFor={svc.name}>{svc.name}</label>
        <input 
          type='checkbox' 
          name={svc.name} 
          value={svc._id}
          onChange={changeHandler}  
        ></input>
      </div>)
    })}
  </div>)
}