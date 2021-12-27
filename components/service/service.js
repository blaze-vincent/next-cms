import { useEffect, useState } from 'react'
import styles from './service.module.css'
import Image from 'next/image'

export default function Service({name, description, id, minimized}){

  const [image, setImage] = useState(null);

  useEffect(_ => {
    description && fetch('/api/imageserviceassociation?' + new URLSearchParams({
      service: id,
      display: true,
    })).then(async res => {
      const json = await res.json();
      if(json.isassociation){
        fetch(`/api/image/${json.isassociation._image}`).then(async res2 => {
          const json2 = await res2.json()
          if(json2.url){
            setImage(json2)
          }
        })
      }
    })
  }, [description, id])

  return (<div className={`${styles.container} ${minimized && styles.minimized}`}>
    <h3>{name}</h3>
    {image && 
        <div className={styles.imageContainer}>
          <Image 
            alt={image.description || `An image tagged as displaying ${name}`} 
            src={image.url}
            width={500}
            height={250}
            layout='responsive'
            objectFit='contain'
          />
        </div>
      }
    {description && <p>{description}</p>}
  </div>)
}