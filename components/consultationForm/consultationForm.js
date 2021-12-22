import styles from './consultationForm.module.css'
import { useEffect, useState } from 'react'
import FormField from '../formField/formField';

export default function ConsultationForm(){
  //name email phone zip services comment
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState(''); //text input
  const [services, setServices] = useState([]);
  const [comment, setComment] = useState('');

  const inputObjs = [
    {
      name: "Name",
      value: name,
      setter: setName,
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "Email address",
      value: email,
      setter: setEmail,
      type: "email",
      placeholder: "example@email.com",
      required: true,
    },
    {
      name: "Phone number",
      value: phone,
      setter: setPhone,
      type: "tel",
      placeholder: "(000) 000-0000",
      required: true,
    },
    {
      name: "Zip code",
      value: zip,
      setter: setZip,
      type: "text", //add constraints
      placeholder: "12345",
      required: true,
    },
    {
      name: "Services",
      value: services,
      setter: setServices,
      type: "checklist", //add array of values / special setter
      required: false,
    },
    {
      name: "Comment",
      value: comment,
      setter: setComment,
      type: "text", //change to textarea
      required: true,
    }
  ]

  const handleSubmit = e => {
    e.preventDefault();
  }

  return (<form
    onSubmit={handleSubmit}
    className={styles.container}
  >
  <small className={styles.small}>* indicates required field</small>
  {
    inputObjs.map((obj, index) => {
      return (<FormField 
        key={index}
        value={obj.value}
        setter={obj.setter}
        name={obj.name}
        type={obj.type}
        placeholder={obj.placeholder}
        required={obj.required}
      />)
    })
  }


  </form>)
}