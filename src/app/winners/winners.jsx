import { useEffect, useState } from 'react'
import { firestore } from '../../lib/sdk/firebase'
import {
  doc,
  onSnapshot,
} from 'firebase/firestore'
import '../../assets/css/winners.css'

export default function WinnersPage() {
    const [masLikes, setMasLikes] = useState(null)
    const [primerosMatches, setPrimerosMatches] = useState(null)
    //Fetch de los ganadores
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, 'ganadores', 'porMasLikes'), (info) => {
            setMasLikes(info.data())
        })
        return unsubscribe
    }, [])
    
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(firestore, 'ganadores', 'porPrimerosMatches'),
                (info) => {
                let data = info.data()
                data.matches.sort((a, b) => a.timestamp - b.timestamp)
                setPrimerosMatches(data)
            }
        )
        return unsubscribe
    }, [])

    return (
        <div className='Winners__globalContainer'>
            <div className='Winners__mainLy'>
                <div>
                    <h1 className='Winners__title'>GANADORES</h1>
                    <h1 style={{color:'red'}}>más guapx hasta ahora</h1>
                    <h2>
                        {
                            masLikes ? 
                            `${masLikes.username} con ${masLikes.likes} likes` : 
                            'cargando...'
                        }
                    </h2>
                </div>
                <div>
                    <h1 style={{color:'red'}}>primeros matches</h1>
                    { 
                        primerosMatches ?
                        primerosMatches.matches.map((item, i) => {
                           return(
                                <h2 key={i}>
                                    #{i+1}: {item.personas[0]} con {item.personas[1]}
                                </h2>
                            )
                        }) : 
                        <h2>cargando...</h2>
                    }
                </div>
            </div>
        </div>
    )
}
