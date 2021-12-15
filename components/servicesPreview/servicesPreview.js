import { useEffect, useState, useRef } from 'react'
import PillButton from '../pillButton/pillButton'
import styles from './servicesPreview.module.css'

export default function ServicesPreview({services}){
  const [selectedService, setSelectedService] = useState(services[0])
  useEffect(_ => {
    //use service information to fetch background image
    // fetch()
  })

  const imageEl = useRef(null)

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
            selectedService.description
          }</p>
          <PillButton size='small' destination={'/services'}>View all our services</PillButton>
        </div>
      </div>
    </div>
  </div>)
}