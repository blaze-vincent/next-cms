import styles from './galleryImage.module.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';

export default function GalleryImage({dbImage, token, services, refresh}){
  const {url, description = ''} = dbImage;
  const date = new Date(dbImage.date).toLocaleString()
  const [expanded, setExpanded] = useState(false);
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [editedDescription, setEditedDescription] = useState(description)
  const [tagEditorVisible, setTagEditorVisible] = useState(false);
  const [tagToAdd, setTagToAdd] = useState(null);
  const [deleteChecks, setDeleteChecks] = useState(0);

  useEffect(_ => {
    const effect = setTimeout(_ => {
      if(deleteChecks){
        setDeleteChecks(0)
      }
    }, 1000)
    return _ => {
      clearTimeout(effect)
    }
  },[deleteChecks])

  const expandImage = function(e){
    setExpanded(!expanded)
  }

  const handleEditDescriptionButtonClick = e => {
    e.stopPropagation();
    setDescriptionEditMode(true);
  }

  return (<div className={styles.container}>
    <div onClick={expandImage} className={`${styles.imgContainer}`}>
      <Image src={url} alt={description || `image uploaded on ${date}`} layout='responsive' objectFit='cover' width={100} height={100}/>
    </div>
    {expanded && <div className={styles.overlay} onClick={expandImage}>
      <div className={styles.description}>
        {descriptionEditMode
        ?<>
        <textarea 
          defaultValue={editedDescription} 
          onClick={e => {e.stopPropagation()}} 
          onChange={e => {setEditedDescription(e.target.value)}} 
        />
        <div className={styles.descriptionUpdateButtons}>
          <button 
            className={styles.saveDescription}
            onClick={e => {
              e.stopPropagation();
              const body = new FormData();
              body.append('imgId', dbImage._id);
              body.append('description', editedDescription);

              fetch('/api/image', {
                method: 'PATCH',
                headers: new Headers({
                  'authorization': token
                }),
                body
              }).then(async res => {
                const json = await res.json();
                setDescriptionEditMode(false);
                refresh()
              })
            }}
          >save description</button>
          <button 
            className={styles.discardDescription}
            onClick={e => {
              e.stopPropagation()
              setEditedDescription(description)
              setDescriptionEditMode(false);
            }}
          >discard changes</button>
        </div>
        </>
        :<>
        {editedDescription}
        {token && <button onClick={handleEditDescriptionButtonClick} className={styles.editDescription}>edit</button>}
        </>
        }
      </div>
      <div className={`${styles.tagsContainer} ${token && styles.column}`}>
        {dbImage.services && dbImage.services.map((dbService, index) => {
          return (<div key={index} className={styles.tagInfoContainer}>
            <div className={styles.tag}>{dbService.name}</div>
            {token && dbService.displayed 
            && <p className={styles.displayText}>displayed</p>
            ||<button 
              className={styles.displayButton}
              onClick={e => {
                e.stopPropagation();

                const body = new FormData();
                body.append("_image", dbImage._id)
                body.append("serviceName", dbService.name)
                
                fetch('/api/imageserviceassociation', {
                  method: "PATCH",
                  body,
                  headers: new Headers({
                    'authorization': token
                  }),
                }).then(async res => {
                  const json = await res.json();
                  if(json.success){
                    //could add indicator here
                  }
                })
                refresh()
              }}
            >
              set display
            </button>}
            {token && <button 
              className={styles.removeTag}
              onClick={e => {
                e.stopPropagation();

                const serviceId = services.filter(svc => {
                  return svc.name === dbService.name;
                }).map(svcObj => {
                  return svcObj._id
                })[0]

                const body = new FormData();
                body.append('_image', dbImage._id);
                body.append('_service', serviceId);

                fetch('/api/imageserviceassociation', {
                  method: 'DELETE',
                  headers: new Headers({
                    'authorization': token
                  }),
                  body
                }).then(async res => {
                  const json = await res.json();

                  setTagToAdd(null);
                  setTagEditorVisible(false);
                  refresh()

                })
              }}
            >remove</button> }
          </div>)
        })}
        <div>{
          token && !tagEditorVisible && <button 
            className={styles.addTag}
            onClick={e => {
              e.stopPropagation();
              setTagEditorVisible(true);
            }}
          >add a tag</button>
        }</div>
        <div>{
          tagEditorVisible && <div className={styles.tagEditor}>
            <div className={styles.tagInputContainer}>
              <label className={styles.label} htmlFor="tag">select tag:</label>
              <select 
                className={styles.tagSelector} 
                onClick={e => {e.stopPropagation()}}
                name="tag"
                onChange={e => {setTagToAdd(e.target.value)}}
              >
                {services.map((service, index) => {
                  return (<option key={index} value={service._id}>{service.name}</option>)
                })}
              </select>
            </div>
            <div className={styles.serviceEditorButtonsContainer}>
              <button 
                className={styles.saveService}
                onClick={e => {
                  e.stopPropagation();

                  const body = new FormData();
                  body.append('service', tagToAdd || services[0]._id);
                  body.append('image', dbImage._id);

                  fetch('/api/imageserviceassociation', {
                    method: 'POST',
                    headers: new Headers({
                      'authorization': token
                    }),
                    body
                  }).then(async res => {
                    const json = await res.json();

                    console.log(json)
                    setTagToAdd(null);
                    setTagEditorVisible(false);
                    refresh()

                  })
                }}
              >
                save
              </button>
              <button 
                className={styles.cancelService}
                onClick={e => {
                  e.stopPropagation();
                  setTagToAdd(null);
                  setTagEditorVisible(false)
                }}
              >
                cancel
              </button>
            </div>
          </div>}</div>
      </div>
      {token && <button 
        className={styles.deleteButton}
        onClick={e => {
          e.stopPropagation();
          if(deleteChecks){
            const body = new FormData();
            body.append('imgId', dbImage._id);

            fetch('/api/image', {
              method: 'DELETE',
              headers: new Headers({
                'authorization': token
              }),
              body
            }).then(async res => {
              const json = await res.json();
              console.log(json)
              refresh()
            })
          } else {
            setDeleteChecks(1);
          }
        }}
      >{deleteChecks ? 'are you sure?' : 'delete image'}</button>}
    </div>}
  </div>)
}

//component remains when object has been successfully deleted
//sideways device support
//about page/admin editor
//service image representation selector
//sort gallery images by newest first
//consultation form/db object/email

//add/remove images
