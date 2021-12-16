import { useEffect, useState, useRef } from 'react'
import GalleryImage from '../galleryImage/galleryImage';
import styles from './imagesEditor.module.css'
import PillButton from '../pillButton/pillButton'

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

  const [addingImage, setAddingImage] = useState(false);
  const [imageToAdd, setImageToAdd] = useState(null);
  const [imageDescription, setImageDescription] = useState("");
  const [imageTags, setImageTags] = useState([]);

  const getSelectedTags = _ => {
    return imageTags.map(tagObj => tagObj.id)
  }

  return (<>
  {token && !addingImage && <button onClick={e => {setAddingImage(true)}}>add image</button>}
  {token && addingImage && <div className={styles.imageAdderContainer}>

    <label htmlFor="image">select image</label>
    <input type="file" name="image" accept="image/*" onChange={e => {setImageToAdd(e.target.files[0])}}/>
    
    <label htmlFor="description">add a comment</label>
    <textarea 
      rows="4" 
      className={styles.textarea}
      onChange={e => {setImageDescription(e.target.value)}}  
    ></textarea>

    <label>select tags</label>
    {services.map((svc, index) => {
      return (<div key={index} className={styles.service}>
        <label for={svc._id}>{svc.name}</label>
        <input 
          type="checkbox" 
          name={svc._id}
          onChange={e => {
            setImageTags(
              e.target.checked &&
              imageTags.concat({
              id: svc._id,
              checked: e.target.checked
            }) || imageTags.filter(
              tag => tag.id !== svc._id 
            )
          )}}  
        />
      </div>)
    })}

    {imageToAdd && imageDescription
    && <button
      onClick={
        e => {
          const body = new FormData();
          body.append('image', imageToAdd);
          body.append('description', imageDescription);
          body.append('services', getSelectedTags())
          console.log(getSelectedTags())

          fetch('/api/image', {
            method: 'POST',
            headers: new Headers({
              'authorization': token
            }),
            body
          }).then(async res => {
            const json = await res.json();
            setAddingImage(false);
            setImageToAdd(null);
            setImageDescription('');
            setImageTags([]);
            fetchNoCache()
          })
        }
      }
    >upload image</button>
    || <p className={styles.errorMsg}>An image and a description are required to submit.</p>
    }
  </div>}
  <div className={styles.container}>
    {dbImages.map((dbImage, index) => {
      return <GalleryImage token={token} dbImage={dbImage} key={index} services={services} refresh={fetchNoCache}/>
    })}
    {inHome ?
    <PillButton size="small" destination="/gallery">View full gallery</PillButton>
    : <button className={styles.loadButton} onClick={updateParams}>Load more pictures</button>
    }
  </div></>)
}