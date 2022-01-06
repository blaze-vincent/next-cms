import styles from './navLinks.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PillButton from '../pillButton/pillButton'

export default function NavLinks({noConsult, inDynamicHeader, hamburgerMenuObj = {inHamburgerMenu: false} }){
    const [links, setLinks] = useState([
        {
            url: '/',
            text: 'Home',
            selected: false
        },
        {
            url: '/about',
            text: 'About',
            selected: false
        },
        {
            url: '/services',
            text: 'Services',
            selected: false
        },
        {
            url: '/gallery',
            text: 'Gallery',
            selected: false
        }
    ])

    const router = useRouter();
    const updateRoute = url => {
        setLinks(links.map(linkObj => {
            linkObj.selected = linkObj.url === url;
            return linkObj;
        }))
    }
    useEffect(_ => {
        updateRoute(router.pathname)
    }, [router.asPath, router.pathname])

    return (<div className={`${styles.container} ${inDynamicHeader && styles.inDynamicHeader} ${hamburgerMenuObj.inHamburgerMenu && styles.inHamburgerMenu}`}>
        {!noConsult && 
            <PillButton 
                destination='/consult' 
                size={hamburgerMenuObj.inHamburgerMenu && 'hamburger'}
                clickHandler={e => {

                    hamburgerMenuObj.inHamburgerMenu
                    && hamburgerMenuObj.terminateHamburgerWithDestination('/consult')
                }}    
            >
                Schedule Consultation
            </PillButton>
        }
        <nav className={`${styles.nav} ${hamburgerMenuObj.inHamburgerMenu && styles.inHamburgerMenu}`}>
            {links.map((linkObj, index) => { return (
                <Link href={linkObj.url} key={index}>
                    <a 
                        className={`${styles.link} ${(linkObj.selected && styles.selected) || styles.notSelected}`}
                        onClick={e => {
                            hamburgerMenuObj.inHamburgerMenu
                            && hamburgerMenuObj.terminateHamburgerWithDestination(linkObj.url)
                        }}
                    >{linkObj.text}</a>
                </Link>)
            })}
        </nav>
    </div>)
}