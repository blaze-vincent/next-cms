import AboutPreview from "../components/aboutPreview/aboutPreview"
import ServicesPreview from "../components/servicesPreview/servicesPreview"
import ImagesEditor from "../components/imagesEditor/imagesEditor"
import Image from '../db/models/Image'
import styles from './page.module.css'
import { useEffect } from "react"
import dbConnect from "../db/connect"
import Service from '../db/models/Service'
import AboutInfo from '../db/models/AboutInfo'

export async function getServerSideProps(){
  await dbConnect();

  const services = JSON.parse(JSON.stringify(await Service.find({secondaryStatus: false}).limit(3)))
  const about = JSON.parse(JSON.stringify(await AboutInfo.findOne()))  
  const backgroundImage = JSON.parse(JSON.stringify(await Image.findOne({homeImage: true})))

  return {
    props: {services, about, backgroundImage},
  }
}

export default function Home({services, about, backgroundImage}){
  
  return (<div className={styles.container}>
    <AboutPreview paragraph={about?.paragraph || 'default'} backgroundImage={backgroundImage}/>
    <ServicesPreview services={services || []}/>
    
    <h2 className={styles.h2}>Gallery</h2>
    <ImagesEditor inHome={true}></ImagesEditor>
  </div>)
}