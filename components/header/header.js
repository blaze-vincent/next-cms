import styles from './header.module.css'
import ContactHeader from '../contactHeader/contactHeader'
import Navbar from '../navbar/navbar'
import { useEffect, useRef, useState } from 'react'

export default function Header({deviceWidth}){
    const containerEl = useRef(null);
    const getContainerHeight = _ => {
        return containerEl.current.getBoundingClientRect().height;
    }

    useEffect(_ => {
        containerEl.current.style.height = `${getContainerHeight()}px`
    }, [])

    const [navbarDynamic, setNavbarDynamic] = useState(false);
    useEffect(_ => {
        let observer = new IntersectionObserver(([container], observer) => {
            const headerHeight = container.boundingClientRect.height;
            const headerIsHidden = window.scrollY > headerHeight;

            setNavbarDynamic(headerIsHidden)
            
        }, {threshold: 0});
        observer.observe(containerEl.current)
    }, [])

    return (<div ref={containerEl} className={styles.container}>
        <ContactHeader />
        <Navbar getParentContainerHeight={getContainerHeight} dynamic={navbarDynamic} deviceWidth={deviceWidth} />
    </div>)
}