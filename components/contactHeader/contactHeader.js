import WidthContainer from "../widthContainer/widthContainer"
import LinkExternal from "../linkExternal/linkExternal"
import styles from './contactHeader.module.css'
import { useEffect, useState } from "react"

export default function ContactHeader(){
    const [showLinkText, toggleLinkText] = useState(false);

    useEffect(_ => {
        const checkWidth = _ => {
            if(window.innerWidth < 815){
                toggleLinkText(false)
            } else {
                toggleLinkText(true)
            }
        }
        checkWidth()
        window.addEventListener('resize', checkWidth)
    }, [])

    return (
        <address className={styles.container}>
            <WidthContainer>
                <div className={styles.spread}>
                    <LinkExternal displayText={showLinkText} type='location' href='https://goo.gl/maps/bvKDL3FsKt4VKyBT9'>
                        16912 145th St, West Burlington, IA 52655
                    </LinkExternal>
                    <LinkExternal displayText={showLinkText} type='email' href='mailto:info@precisioncoatingsiowa.com'>
                        info@precisioncoatingsiowa.com
                    </LinkExternal>
                    <LinkExternal displayText={showLinkText} type='phone' href='tel:3193924639'>
                        +1 (319) 392-4639
                    </LinkExternal>
                </div>
            </WidthContainer>
        </address>)
}