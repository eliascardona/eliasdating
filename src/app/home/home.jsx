import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, firestore } from '../../lib/sdk/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { Card } from '../../components/utils/Card'
import { PageHeader } from '../../components/utils/PageHeader'
import { ModalTwo } from '../../components/modals/ModalTwo'
import { MatchNotification } from '../../components/modals/MatchNotification'
import '../../assets/css/home.css'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [owner, setOwner] = useState()
  const [ownerName, setOwnerName] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/signup')
        setCurrentUser(p => p)
      }
      setCurrentUser({...user})
    })
  },[auth])

  //Fetch datos del usuario
  useEffect(() => {
    if(auth === null || currentUser === null) return
      const q = query(
        collection(firestore, 'users'),
        where('email', '==', currentUser ? currentUser.email : '')
      )
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
              const ownerTemp = querySnapshot.docs[0].data()
              if(ownerTemp != null) {
                setOwner({ ...ownerTemp })
                setOwnerName(ownerTemp.username)
              }
        }
      )
      return unsubscribe
  }, [auth, currentUser])
    
  //Fetch datos de todos los usuarios
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'users'),
      (querySnapshot) => {
        const res = []
        querySnapshot.forEach((doc) => {
          res.push(doc.data())
        })
        setUsers(res)
      }
    )
    return unsubscribe
  }, [])
  
  //Fetch de todos los posts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'posts'),
      (querySnapshot) => {
        let data = []
        querySnapshot.forEach((doc) => {
          data.push(doc.data())
        })
        const sortedData = data.sort((a, b) => b.timestamp - a.timestamp)
        setPosts(sortedData)
      }
    )
    return unsubscribe
  }, [ownerName.length])

  const [matches, setMatches] = useState([])
  //Estado de apertura de notificaciones de match según la cant de matches, hay n notifs. ej: [true, false, true]
  const [notifStates, setNotifStates] = useState([])
    
  //Búsqueda de matches al cambiar el estado de owner o users
  useEffect(() => {
    const findMatches = () => {
      const matches = []
      if(owner && users) {
        const ownerLikes = owner.likes
        const otherUsers = users.filter((u) => u.id != owner.id)
        for(let user of otherUsers) {
          if ( ownerLikes.includes(user.username) && user.likes.includes(owner.username) ) {
            matches.push(user)
          }
        }
      }
      setMatches(matches)
      //Inicializa las notificaciones como abiertas
      setNotifStates(
        matches.map((value, i) => (notifStates[i] ? notifStates[i] : true))
      )
    }
    findMatches()
  }, [owner, users])

  const handleNotifStateChange = (i) => {
    const nuevaLista = [...notifStates]
    nuevaLista[i] = !nuevaLista[i]
    setNotifStates(nuevaLista)
  }
  
  return (
    <>
      <PageHeader />
      <h1 className='title'>ADAM LIKES YOU</h1>
      <div className='container'>
        {posts.map((post, i, arr) => {
          return (
            <Card
              remitente={post.remitente}
              destinatario={post.destinatario}
              timestamp={post.timestamp}
              key={post.cardID}
            />
          )
        })}
        <button type='button' className='specialBtn' onClick={() => setOpenModal(true)}>
          CONFESAR LIGUE
        </button>
        {openModal && (
          <ModalTwo
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        )}
        {matches.map((match, i) => {
          return (
            <MatchNotification
              openNotif={notifStates[i]}
              setOpenNotif={() => {
                handleNotifStateChange(i)
              }}
              notTo={match.username}
              key={match.id}
              notifStatesParam={notifStates}
            />
          )
        })}
      </div>
    </>
  )
}
