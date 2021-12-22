import { useState, useEffect } from 'react';
import ServicesChecklistInput from '../servicesChecklistInput/servicesChecklistInput';
import styles from './formField.module.css'

export default function FormField({value, name, setter, type, placeholder, required, onError}){

  let input = null;
  const [error, flagError] = useState(false);
  useEffect(_ => {
    onError(error)
  }, [error])

  switch(type){
    case "checklist":
      input = (<ServicesChecklistInput 
        value={value} 
        setter={setter}
      />)
      break;
    case "textarea":
      input = (<textarea 
        onChange={e => {
          setter(e.target.value)
          e.target.style.height = `${e.target.scrollHeight + 2}px`;
        }}
        value={value}
        className={styles.textarea}  
        required={required}
      />)
      break;
    case "tel":
      input = (<input
        type={type}
        name={name}
        className={styles.input}
        onChange={e => {setter(e.target.value)}}
        value={value}
        placeholder={placeholder}
        pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
        title="1234567890, 123 456 7890, or (123) 456-7890"
        required={required}
      />)
      break;
    case "zip":
      input = (<input
        type={"text"}
        name={name}
        className={styles.input}
        onChange={e => {setter(e.target.value)}}
        value={value}
        placeholder={placeholder}
        pattern="^\d{5}(-\d{4})?$"
        title="12345 or 12345-6789"
        required={required}
      />)
      break;
    default:
      input = (<input
        type={type}
        name={name}
        className={styles.input}
        onChange={e => {setter(e.target.value)}}
        value={value}
        placeholder={placeholder}
        required={required}
      />)
      break;
  }


  return (<div className={styles.container}>
    <label
      htmlFor='name'
      className={styles.label}
    >{`${name}${required && ' * ' || ''}`}: </label>
    {input}
  </div>)
}