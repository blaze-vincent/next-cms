import Service from '../components/service/service';
import styles from './page.module.css'

export async function getStaticProps(){
  const services = await fetch('http://localhost:3000/api/service');
  const data = await services.json()
  return {
    props: data
  }
}

export default function Services(props){
  return (<div className={styles.container}>
    <br></br>
    <h1 className={styles.h1}>Our Primary Services</h1>
    
    {props.services.filter(item => item.description).map((svc, index) => {
      return (<Service 
        key={index}
        name={svc.name}
        description={svc.description}
        id={svc._id}
      />)
    })}

    <h2 className={styles.h2}>Other Services Offered</h2>
    
    {props.services.filter(item => !item.description).map((svc, index) => {
      return (<Service 
        key={index}
        name={svc.name}
        minimized={true}
      />)
    })}

    </div>)
}