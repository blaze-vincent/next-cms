import { useEffect, useRef, useState } from 'react'
import styles from './hamburgerMenu.module.css'
import NavLinks from '../navLinks/navLinks';
import { useRouter } from 'next/router'

export default function HamburgerMenu({getTop, noConsult}){

    const [menuActive, toggleMenuActive] = useState(false);
    const [menuVisible, toggleMenuVisible] = useState(false);
    const [terminationUrl, setTerminationUrl] = useState(null);
    const router = useRouter();

    useEffect(_ => {
        let effect;
        if(!menuVisible){
            effect = setTimeout(_ => {
                toggleMenuActive(false);
                if(terminationUrl){
                    setTerminationUrl(null);
                    router.push(terminationUrl)
                }
            }, 250)
        }
        document.querySelector('body').style.overflow = menuVisible ? 'hidden' : '';
        return _ => {if(effect){clearTimeout(effect)}}
    }, [menuVisible])

    useEffect(_ => {
        setMenuSize()
        toggleMenuVisible(menuActive);
    }, [menuActive])

    useEffect(_ => {
        if(terminationUrl){
            toggleMenuVisible(false);
        }
    }, [terminationUrl])
    
    
    const menuEl = useRef(null);
    const setMenuSize = _ => {
        if(menuEl.current){
            menuEl.current.style.height = `calc(100vh - ${getTop()}px)`
            menuEl.current.style.top = `${getTop()}px`
        }
    }

    return (<div  className={styles.container}>
        <button onClick={_ => {
            if(menuActive){
                toggleMenuVisible(false)
            } else {
                toggleMenuActive(true)
            }
            }} className={`${styles.hamburgerBtn} ${menuVisible && styles.btnSelected}`}>
            <div /> <div /> <div />
        </button>
        <div ref={menuEl} className={`${styles.menu} ${menuActive && styles.active} ${menuVisible && styles.visible}`}>
            <NavLinks hamburgerMenuObj={
                {
                inHamburgerMenu: true, 
                terminateHamburgerWithDestination: url => {
                        setTerminationUrl(url)
                    }
                }
            } noConsult={noConsult}/>
        </div>
    </div>)
}