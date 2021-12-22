import { useState, useEffect } from 'react'
import ConsultationRequest from '../consultationRequest/consultationRequest';
import styles from './consultationRequestViewer.module.css'

export default function ConsultationRequestViewer({token}){
    
    const [consultationRequests, setConsultationRequests] = useState([]);
    useEffect(_ => {
        fetch('/api/consultation', {
            headers: new Headers({
                'authorization': token
            })
        }).then(async res => {
            const json = await res.json();
            if(json.consultationRequests){
                setConsultationRequests(json.consultationRequests);
            }
        })
    }, [])

    const refreshRequests = function(filteredRequest){
        setConsultationRequests(
            consultationRequests.filter(req => {
                return req._id !== filteredRequest._id
            })
        )
    }

    return (<div className={styles.container}>
        {
            consultationRequests.map((request, index) => {
                return <ConsultationRequest 
                    key={index} 
                    token={token} 
                    request={request} 
                    refresh={refreshRequests}
                />
            })
        }
    </div>)
}