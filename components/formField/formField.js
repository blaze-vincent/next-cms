import styles from './formField.module.css'

export default function FormField({value, name, setter, type, placeholder}){

  let specialInput = null;
  switch(type){
    case "checklist":
      specialInput= (<>
        {
          //checkbox for each value
        }
      </>)
      break;
    case "textarea":

      break;
    default:

      break;
  }


  return (<div className={styles.container}>
    <label
      htmlFor='name'
      className={styles.label}
    >{name}: </label>
    <input
      type={type}
      name={name}
      className={styles.input}
      onChange={e => {setter(e.target.value)}}
      value={value}
      placeholder={placeholder}
    />
  </div>)
}