import { useState, useEffect, useRef } from 'react'
import dbConnect from '../db/connect'
import AboutInfo from '../db/models/AboutInfo'
import Image from '../db/models/Image'
import styles from './page.module.css'

export async function getStaticProps(){

    await dbConnect()
    const dbDescription = await JSON.parse(JSON.stringify(await AboutInfo.findOne()))
    const backgroundImage = JSON.parse(JSON.stringify(await Image.findOne({aboutImage: true})))
    //set background image of about page
    //add superadmin to josh
    //allow superadmin to create blank users
    //upon first signin of blank user, request password
    return {
      props: {dbDescription, backgroundImage}
    }
  }

export default function About(props){
    const [description, setDescription] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed ante porta, aliquet sapien at, pretium sapien. Praesent sed viverra elit. Integer sit amet est erat. Aliquam viverra dui tortor, imperdiet sodales mauris cursus lacinia. Morbi et tellus placerat, egestas nisi eu, efficitur risus. Morbi id leo eu sem blandit elementum in a mi. Quisque feugiat fringilla risus, eu finibus risus varius vel. Duis consectetur, diam consectetur placerat volutpat, orci sem tristique lorem, a mattis nulla quam non nisl.')
    useState(_ => {
        if(props.dbDescription){
            setDescription(props.dbDescription.paragraph)
        }
    })

    const backgroundEl = useRef(null)
    useEffect(_ => {
        if(props.backgroundImage){
            if(backgroundEl.current){
                console.log('this is happening')
                backgroundEl.current.style.backgroundImage = `url('${props.backgroundImage.url}')`;
                console.log(backgroundEl.current.style.background)
            }
        }
    }, [])
    return (<div className={`${styles.container} ${styles.noPadding}`}>
        <div className={styles.aboutContainer}>
            <div ref={backgroundEl} className={styles.backgroundImage}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.h1}>Precision Coatings</h1>
                    <p className={styles.p}>{description}</p>
                </div>
            </div>
        </div>
    </div>)
}