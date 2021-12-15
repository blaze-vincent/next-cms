import styles from './footer.module.css'
import WidthContainer from '../widthContainer/widthContainer'
import FooterContentSection from '../footerContentSection/footerContentSection'
import LinkExternal from '../linkExternal/linkExternal'

export default function Footer({deviceWidth}){
    return (<footer className={styles.container}>
        <WidthContainer>
            <div className={styles.content}>
                <div className={`${styles.sections} ${(deviceWidth === 'mobile') ? styles.column : (deviceWidth === 'tablet') && styles.tablet}`}>
                    <FooterContentSection title="Business Hours" alignCenter={deviceWidth === 'mobile'}>
                        Monday - Friday: 8AM to 5PM
                    </FooterContentSection>
                    <FooterContentSection title="Contact Us" alignCenter={true}>
                        <LinkExternal type='location' href='https://goo.gl/maps/bvKDL3FsKt4VKyBT9'>
                            16912 145th St, West Burlington, IA 52655
                        </LinkExternal>
                        <LinkExternal type='email' href='mailto:info@precisioncoatingsiowa.com'>
                            info@<wbr />precisioncoatingsiowa.com
                        </LinkExternal>
                        <LinkExternal type='phone' href='tel:3193924639'>
                            +1 (319) 392-4639
                        </LinkExternal>
                    </FooterContentSection>
                    {(deviceWidth === 'desktop') && <FooterContentSection alignRight={true} spaceFiller={true} />}
                </div>
                <div className={styles.credit}>
                    <div className={styles.copyright}>
                        <p>Copyright © 2021 Precision Coatings. </p>
                        <p>All rights reserved.</p>
                    </div>
                    <p>Website created by <b>Blaze Vincent</b></p>
                </div>
            </div>
        </WidthContainer>
    </footer>)
}