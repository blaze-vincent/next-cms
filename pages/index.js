import AboutPreview from "../components/aboutPreview/aboutPreview"
import ServicesPreview from "../components/servicesPreview/servicesPreview"
import ImagesEditor from "../components/imagesEditor/imagesEditor"
import Image from '../db/models/Image'
import styles from './page.module.css'
import { useEffect } from "react"
import dbConnect from "../db/connect"

export async function getStaticProps(){
  const dbServices = await fetch('http://localhost:3000/api/service?primary=true');
  const services = await dbServices.json()
  const dbAbout = await fetch('http://localhost:3000/api/homedescription');
  const about = await dbAbout.json()

  //the realisation that you can directly access mongoose from staticprops just set in
  await dbConnect()
  const backgroundImage = JSON.parse(JSON.stringify(await Image.findOne({homeImage: true})))

  return {
    props: {services, about, backgroundImage}
  }
}

export default function Home(props){
  
  return (<div className={styles.container}>
    <AboutPreview paragraph={props.about.dbDescription.paragraph} backgroundImage={props.backgroundImage}/>
    <ServicesPreview services={props.services.services}/>
    
    <h2 className={styles.h2}>Gallery</h2>
    <ImagesEditor inHome={true}></ImagesEditor>
  </div>)
}