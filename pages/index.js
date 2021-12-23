import AboutPreview from "../components/aboutPreview/aboutPreview"
import ServicesPreview from "../components/servicesPreview/servicesPreview"
import ImagesEditor from "../components/imagesEditor/imagesEditor"
import styles from './page.module.css'

export async function getStaticProps(){
  const dbServices = await fetch('http://localhost:3000/api/service?primary=true');
  const services = await dbServices.json()
  const dbAbout = await fetch('http://localhost:3000/api/about');
  const about = await dbAbout.json()
  return {
    props: {services, about}
  }
}

export default function Home(props){
  return (<div className={styles.container}>
    <AboutPreview paragraph={props.about.dbAbout.paragraph}/>
    <ServicesPreview services={props.services.services}/>
    
    <h2 className={styles.h2}>Gallery</h2>
    <ImagesEditor inHome={true}></ImagesEditor>
  </div>)
}