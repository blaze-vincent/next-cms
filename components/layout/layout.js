import Head from 'next/head'
import styles from './layout.module.css'
import WidthContainer from '../widthContainer/widthContainer'
import Header from '../header/header'
import { useState, useEffect } from 'react'
import Footer from '../footer/footer'

export default function Layout(props) {

  const BREAKPOINTS = {
    675: 'mobile',
    900: 'tablet',
    16000: 'desktop'
  }
  const [deviceWidth, setDeviceWidth] = useState('mobile');
  useEffect(_ => {
      const checkWidth = _ => {
          for(let i in BREAKPOINTS){
              if(window.innerWidth < i){
                  setDeviceWidth(BREAKPOINTS[i])
                  break;
              }
          }
      }
      checkWidth()
      window.addEventListener('resize', checkWidth)
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Precision Coatings</title>
        <meta name="description" content="Southeast Iowa-based painting contractors specializing in epoxy floors and commercial painting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header deviceWidth={deviceWidth} />

      <main className={styles.main}>
        <WidthContainer>
          <div className={styles.mainContent}>
            {props.children}
          </div>
        </WidthContainer>
      </main>
      
      <Footer deviceWidth={deviceWidth}/>
    </div>
  )
}
