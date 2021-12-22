import ServicesChecklistInput from '../servicesChecklistInput/servicesChecklistInput';
import styles from './formField.module.css'

export default function FormField({value, name, setter, type, placeholder, required}){

  let input = null;
  switch(type){
    case "checklist":
      input = (<ServicesChecklistInput 
        value={value} 
        setter={setter}
      />)
      break;
    case "textarea":

      break;
    default:
      input = (<input
        type={type}
        name={name}
        className={styles.input}
        onChange={e => {setter(e.target.value)}}
        value={value}
        placeholder={placeholder}
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