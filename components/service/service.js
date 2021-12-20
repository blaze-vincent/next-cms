import { useEffect, useState } from 'react'
import styles from './service.module.css'
import Image from 'next/image'

export default function Service({name, description, id, minimized}){

  const [image, setImage] = useState(null);

  useEffect(_ => {
    description && fetch(`/api/image/${id}`).then(async isa_body => {
      const json = isa_body.ok && await isa_body.json();
      isa_body.ok && setImage(json);
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