import styles from './hamburgerHelper.module.css'
import NavLinks from '../navLinks/navLinks'
import HamburgerMenu from '../hamburgerMenu/hamburgerMenu'
import PillButton from '../pillButton/pillButton'

export default function HamburgerHelper({inDynamicHeader, deviceWidth, getTop}){

    return (<div className={styles.container}>
        {
            deviceWidth === 'desktop'
            ? <NavLinks inDynamicHeader={inDynamicHeader} />
            :
            deviceWidth === 'tablet' && inDynamicHeader
            ? <div className={styles.group}>
                <PillButton destination='/contact'>Schedule Consultation</PillButton>
                <HamburgerMenu getTop={getTop} noConsult={true} />
            </div>
            : 
            deviceWidth === 'mobile'
            ? <HamburgerMenu getTop={getTop} />
            : <NavLinks inDynamicHeader={inDynamicHeader} />
        }
    </div>)
}