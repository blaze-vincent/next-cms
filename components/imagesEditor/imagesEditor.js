import { useEffect, useState, useRef } from 'react'
import GalleryImage from '../galleryImage/galleryImage';
import styles from './imagesEditor.module.css'
import Link from 'next/link'

export default function ImagesEditor({token, inHome}){
  const [dbImages, setDbImages] = useState([]);
  const [reqParams, setReqParams] = useState({limit: 9, skip: 0});

  const fetchImages = function(headers, wipe){
    fetch('/api/image?' + new URLSearchParams(reqParams), {
      method: 'GET',
      headers: headers
    }).then(async response => {
      const json = await response.json()
      if(!wipe){
        setDbImages(dbImages ? dbImages.concat(json.images) : json.images)
      } else {
        console.log(json.images)
        setDbImages(json.images)
      }
    })
  }
  const fetchNoCache = function(){
    const headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');
    fetchImages(headers, true)
  }

  const updateParams = function(){
    setReqParams({limit: reqParams.limit, skip: reqParams.skip + reqParams.limit})
  }

  useEffect(_ => {
    fetchImages()
  }, [reqParams])

  const [services, setServices] = useState([])
  const servicesObj = useRef(null)
  useEffect(_ => {
    if(!services.current){
      fetch('/api/service', {
        method: 'GET'
      }).then(async response => {
        response.json().then(json => {
          servicesObj.current = json;
          setServices(json.services)
        })
      })
    }
  }, [])

  return (<>
  {token && <button>add image</button>}
  <div className={styles.container}>
    {dbImages.map((dbImage, index) => {
      return <GalleryImage token={token} dbImage={dbImage} key={index} services={services} refresh={fetchNoCache}/>
    })}
    {inHome ?
    <button className={styles.loadButton}><Link href='/gallery'><a>See all pictures</a></Link></button>
    : <button className={styles.loadButton} onClick={updateParams}>Load more pictures</button>
    }
  </div></>)
}