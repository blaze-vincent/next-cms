import Service from '../components/service/service';
import styles from './page.module.css'
import dbService from '../db/models/Service';
import dbConnect from '../db/connect';

export async function getStaticProps(){
  await dbConnect();
  const data = JSON.parse(JSON.stringify( await dbService.find({})))
  return {
    props: {services: data}
  }
}

export default function Services({services}){

  const describedServices = services.filter(item => item.description);
  const undescribedServices = services.filter(item => !item.description);

  return (<div className={styles.container}>
    <br></br>
    <h1 className={styles.h1}>Our Primary Services</h1>
    
    {describedServices.map((svc, index) => {
      return (<Service 
        key={index}
        name={svc.name}
        description={svc.description}
        id={svc._id}
      />)
    })}

    {
      undescribedServices.length > 0
      && <h2 className={styles.h2}>Other Services Offered</h2>
    }
    
    {
      undescribedServices.map((svc, index) => {
        return (<Service 
          key={index}
          name={svc.name}
          minimized={true}
      />)})
    }

    </div>)
}