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

  const [formSubmitted, setFormSubmitted] = useState(false);

  const inputObjs = [
    {
      id: "name",
      name: "Name",
      value: name,
      setter: setName,
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      id: "email",
      name: "Email address",
      value: email,
      setter: setEmail,
      type: "email",
      placeholder: "example@email.com",
      required: true,
    },
    {
      id: "phone",
      name: "Phone number",
      value: phone,
      setter: setPhone,
      type: "tel",
      placeholder: "(000) 000-0000",
      required: true,
    },
    {
      id: "zipcode",
      name: "Zip code",
      value: zip,
      setter: setZip,
      type: "zip", //add constraints
      placeholder: "12345",
      required: true,
    },
    {
      id: "services",
      name: "Services",
      value: services,
      setter: setServices,
      type: "checklist",
      required: false,
    },
    {
      id: "comment",
      name: "Comment",
      value: comment,
      setter: setComment,
      type: "textarea",
      required: true,
    }
  ]

  const handleSubmit = e => {
    e.preventDefault();
    const body = new FormData();
    inputObjs.forEach(obj => {
      body.set(obj.id, obj.value)
    })
    fetch('/api/consultation', {
      method: 'POST',
      body
    }).then(res => {
      console.log(res);
      if(res.ok){
        setFormSubmitted(true);
      }
    })
  }

  return !formSubmitted && (<form
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
  <button 
      className={styles.submit}
      type="submit"
  >Submit request</button>

  </form>)


  || (<p className={styles.p}>Thank you for your request!</p>)
}