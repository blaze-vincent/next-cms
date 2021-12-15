import { useEffect, useState } from 'react'
import ServiceEditable from '../serviceEditable/serviceEditable'
import styles from './servicesEditor.module.css'

export default function ServicesEditor({token}){
  const [serviceObjects, setServiceObjects] = useState({})
  const [servicesPrimary, setServicesPrimary] = useState([])
  const [servicesToSave, setServicesToSave] = useState([])
  const [impedingError, setImpedingError] = useState(false);

  const getServiceObjects = function(){
    fetch('/api/service', {
      method: 'GET'
    }).then(async response => {
      const json = await response.json();
      setServiceObjects(json.services)
      setServicesPrimary(json.services.filter(service => !service.secondaryStatus))
    })
  }
  const createNewService = function(){

    const body = new FormData();
    body.append('name', 'New Service');
    body.append('description', '');
    body.append('secondaryStatus', true);

    fetch('/api/service', {
      method: 'POST',
      headers: new Headers({
        'authorization': token
      }),
      body
    }).then(async res => {
      const json = await res.json();
      if(json.success){
        getServiceObjects()
      }
    })
  }

  const addServiceToSave = (serviceId, saveFunction, saveFlag) => {
    if(saveFlag){
      setServicesToSave([...new Set(servicesToSave.concat({id: serviceId, saveFunction}))])
    } else {
      setServicesToSave(servicesToSave.filter(svc => {
        return svc.id !== serviceId;
      }))
    }
  }

  const saveAll = _ => {
    servicesToSave.forEach((service, index, arr) => {
      service.saveFunction(token, index, arr.length);
    })
    setTimeout(_ => {
      setServicesToSave([])
      setServiceObjects({})
      getServiceObjects()
    }, 1000)
  }

  const setServicePrimary = (serviceObj, primary) => {
    if(primary){
      setServicesPrimary([...new Set(servicesPrimary.concat(serviceObj))])
    } else {
      setServicesPrimary(servicesPrimary.filter(service => {
        return service !== serviceObj
      }))
    }
  }

  const deleteService = function(_id){
    const body = new FormData();
    body.append('_id', _id);

    fetch('/api/service', {
      method: 'DELETE',
      headers: new Headers({
        'authorization': token
      }),
      body
    }).then(async res => {
      const json = await res.json();
      if(json.success){
        getServiceObjects()
      }
    })
  }

  useEffect(_ => {
    setImpedingError((servicesPrimary.length !== 3))
  }, [servicesPrimary])

  useEffect(_ => {
    getServiceObjects()
  }, [])
  return (<div className={styles.container}>
    <p className={styles.selectedServices}>The following services are displayed on the home page: {servicesPrimary.map((service, index) => {
      return <span key={index}>
        <b>{service.name}</b>
        {`${(index === servicesPrimary.length - 1) ?  '.' : (index === servicesPrimary.length - 2) ? ', and ' : ', ' }`}
        </span>
    })}</p>
    {impedingError && <b className={styles.warning}>
      Warning: there must be{servicesPrimary.length > 3 ? ' only' : ''} 3 services selected to display on the home page. Until this is fixed, your changes can not be saved.
    </b>}
    {(!impedingError && servicesToSave.length > 0) && <span className={styles.changes}>
      <u className={styles.p}> 
        <p className={styles.p}>
          There {servicesToSave.length === 1 ? 'is ' : 'are ' }<b>{servicesToSave.length}</b> unsaved change{servicesToSave.length === 1 ? '' : 's' }.
        </p>
      </u>
      <button className={styles.button} onClick={saveAll}>Save changes</button>
    </span>}
    <div className={styles.newService} onClick={createNewService}>
      <h3 className={styles.newServiceTitle}>Create a new service</h3>
      <button className={styles.newServiceBtn}><div /> <div /></button>
    </div>
    {Object.keys(serviceObjects).map((_, index) => {
      return <ServiceEditable 
        key={index} 
        serviceObj={serviceObjects[index]} 
        flagStatusPrimary={setServicePrimary}
        flagSavable={addServiceToSave}
        flagForDeletion={deleteService}
      />
    })}
  </div>)
}