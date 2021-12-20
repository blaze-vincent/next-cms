import { useState } from 'react'
import ConsultationForm from '../components/consultationForm/consultationForm'
import styles from './page.module.css'

export default function Consult(){

  return (<div className={styles.container}>
    <br></br>
    <h1 className={styles.h1}>Schedule Your Free Consultation</h1>
    <ConsultationForm />
  </div>)
}