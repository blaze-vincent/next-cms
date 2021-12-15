import { useEffect, useRef, useState } from 'react'
import HamburgerHelper from '../hamburgerHelper/hamburgerHelper'
import PrecisionLogo from '../precisionLogo/precisionLogo'
import WidthContainer from '../widthContainer/widthContainer'
import styles from './navbar.module.css'

export default function Navbar({getParentContainerHeight, dynamic, deviceWidth}){
  const staticContainerEl = useRef(null);
  const dynamicContainerEl = useRef(null);

  const staticContainerHeight = useRef(null);
  useEffect(_ => {
    if(!staticContainerHeight.current){
      staticContainerHeight.current = staticContainerEl.current.getBoundingClientRect().height;
    }
    staticContainerEl.current.style.height = `${staticContainerHeight.current}px`;
  }, [])
  const getDynamicContainerHeight = _ => {
    return dynamicContainerEl.current.getBoundingClientRect().height;
  }

  const [enteringDynamic, setEnteringDynamic] = useState(false)
  useEffect(_=>{
    const effect = setTimeout(_ => {
      setEnteringDynamic(dynamic)
    }, 250)

    return (_ => {clearTimeout(effect)})
  }, [dynamic])

  return (<div ref={staticContainerEl} className={styles.containerStatic}>
    <div ref={dynamicContainerEl} className={
      `${styles.containerDynamic} ` +
      `${dynamic && styles.dynamicMode} ` +
      `${enteringDynamic && styles.enteringDynamic} `
      }>
      <WidthContainer>
        <div className={styles.spacer}>
          <PrecisionLogo small={dynamic} />
          <HamburgerHelper inDynamicHeader={dynamic} deviceWidth={deviceWidth} getTop={
            dynamic ? getDynamicContainerHeight : getParentContainerHeight
          }/>
        </div>
      </WidthContainer>
    </div>
  </div>)
}