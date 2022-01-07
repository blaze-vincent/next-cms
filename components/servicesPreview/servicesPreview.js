import { useEffect, useState, useRef } from 'react'
import PillButton from '../pillButton/pillButton'
import styles from './servicesPreview.module.css'

export default function ServicesPreview({services}){
  const [selectedService, setSelectedService] = useState(services[0])
  const imageEl = useRef(null)
  const backgroundImages = useRef([null, null, null]);

  useEffect(_ => {
    services.forEach((svc, index) => {
      fetch('/api/imageserviceassociation?' + new URLSearchParams({
        service: svc._id,
        display: true,
      })).then(async res => {
        const json = await res.json();
        if(json.isassociation){
          fetch(`/api/image/${json.isassociation._image}`).then(async res2 => {
            const json2 = await res2.json()
            if(json2.url){
              let temp = [...backgroundImages.current]
              temp[index] = json2.url
              backgroundImages.current = temp;
            }
          })
        }
      })
    })
  }, [services])

  useEffect(_ => {
    if(imageEl.current){
      const url = backgroundImages.current[services.indexOf(selectedService)]
      if(url){
        imageEl.current.style.backgroundImage = `url(${url})`
      }
    }
  }, [selectedService, services])

  //expect three services
  return (<div className={styles.container}>
    <h2 className={styles.h2}>Our Primary Services</h2>
    <div className={styles.content}>
      <div className={styles.imageSection}>
        <div ref={imageEl} className={styles.background} />
      </div>
      <div className={styles.sections}>
        {services.map((serviceObj, index) => {
          return (<div 
            key={index} 
            className={`${styles.serviceTab} ${(serviceObj === selectedService) && styles.selected}`}
            onClick={
              e => {setSelectedService(services.find(service => {
                return service.name === serviceObj.name
              }))
            }}
          >
            {serviceObj.name}
          </div>)
        })}
      </div>
      <div className={styles.info}>
        <div className={styles.infoInnerContainer}>
          <p className={styles.description}>{
            selectedService?.description || 'default'
          }</p>
          <PillButton size='small' destination={'/services'}>View all our services</PillButton>
        </div>
      </div>
    </div>
  </div>)
}