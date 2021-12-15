import styles from './precisionLogo.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function PrecisionLogo({small}){
    return(<div className={`${styles.container} ${small && styles.small}`}>
        <Link passHref={true} href='/'>
            <a>
                <Image src='/precision.png' alt='Precision Coatings logo' layout='responsive' width={2} height={1} />
            </a>
        </Link>
    </div>)
}