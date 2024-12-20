import { useEffect, useRef, useState } from 'react'
import { auth, firestore } from '../../lib/sdk/firebase'
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { numeroAleatorio } from '../../lib/utils/utils'
import '../../assets/css/forms.css'


export const MatchForm = () => {
  const [owner, setOwner] = useState()
  const [err, setErr] = useState('')
  const usernameRef = useRef()
  const [users, setUsers] = useState([])
  const [ganadores, setGanadores] = useState()
  const [succesMsg, setSuccesMsg] = useState('')
  const [disabled, setDisabled] = useState(false)

  //get users collection data
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
  }, [auth])

  //get owner data
  useEffect(() => {
    if (auth.currentUser === null) return

    const q = query(
      collection(firestore, 'users'),
      where('email', '==', auth.currentUser ? auth.currentUser.email : '')
    )
    const unsubscribe = onSnapshot(q,
      (snap) => {
        const snapData = snap.docs[0].data()
        if(snapData != null) {
          setOwner(snapData)
		}
      }
	)
    return unsubscribe
  }, [auth])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'ganadores'),
      (querySnapshot) => {
        let data = []
        querySnapshot.forEach((doc) => {
          data.push(doc.data())
        })
        setGanadores({
          porMasLikes: data[0],
          porPrimerosMatches: data[1],
        })
      }
    )
    return unsubscribe
  }, [])

  // let userName = usernameRef.current.value
  const [mainSubject, setMainSubject] = useState('')

  const confessCrush = async () => {
    setErr('')
    setDisabled(true)
    const usersRef = collection(firestore, 'users')

    let trimmedMainSubject = mainSubject.trim()
    if (trimmedMainSubject[0] != '@') {
      trimmedMainSubject = `@${trimmedMainSubject}`
    }

    if (trimmedMainSubject == owner.username) {
      setErr('No puedes ingresar tu propio usuario.')
      return
    }

    //Consultar perfil del destinatario
    const destinatario = query(usersRef, where('username', '==', trimmedMainSubject))
    const consultaDesatinatario = await getDocs(destinatario)
    const objetoDestinatario = consultaDesatinatario.docs[0]
      ? consultaDesatinatario.docs[0].data()
      : undefined

    //Consultar perfil del remitente
    //A pesar de que sea un arreglo, la variable la dejamos como 'objetoRemitente'
    const remitente = query(usersRef, where('username', '==', owner.username))
    const consultaRemitente = await getDocs(remitente)
    const objetoRemitente = consultaRemitente.docs[0].data().likes
    const usernameRemitente = consultaRemitente.docs[0].data().username

    if (objetoDestinatario) {
      if (objetoDestinatario.likes.includes(usernameRemitente)) {
        setErr('Ya le enviaste tu confesión al usuario ingresado 🤷‍♂️')
        setDisabled(false)
        setErr('')        
        return
      }
      let date = new Date()
      await updateDoc(doc(firestore, 'users', objetoDestinatario.email), {
        likes: arrayUnion(owner.username),
      })
      const updatedDestinatario = await getDoc(
        doc(firestore, 'users', objetoDestinatario.email)
	  )
      .then((doc) => {
        doc.data()
      })

      if(updatedDestinatario.likes.length > ganadores.porMasLikes.likes) {
        await setDoc(doc(firestore, 'ganadores', 'porMasLikes'), {
          likes: updatedDestinatario.likes.length,
          username: updatedDestinatario.username
        })
      }
      const newConfessionPayload = {
        remitente: owner.username,
        destinatario: mainSubject,
        timestamp: date.getTime(),
      }

      const newDocRef = await addDoc(doc(firestore, 'posts'), newConfessionPayload)
      await updateDoc(newDocRef, {
        cardID: newDocRef.id
	  })

      //Verificar si hay match viendo si existe el perfil en los likes del remitente
      if (objetoRemitente.includes(objetoDestinatario.username)) {
        const usersArr = [
          usernameRemitente,
          objetoDestinatario.username,
        ]
        const sortedUsersArray = usersArr.sort()
        //Agregar doc con sus respectivos matches
        await setDoc(
          doc(
            firestore,
            'matches',
            `${usernameRemitente}-${objetoDestinatario.username}`
          ),
          {
            users: sortedUsersArray,
            timestamp: date.toISOString(),
          }
        )

        if (
          ganadores.porPrimerosMatches.matches.length < 3 &&
          ganadores.porPrimerosMatches.matches.filter(
            (i) => JSON.stringify(i.personas) == JSON.stringify(sortedUsersArray)
          ).length == 0
        ) {
          updateDoc(doc(firestore, 'ganadores', 'porPrimerosMatches'), {
            matches: arrayUnion({
              personas: sortedUsersArray,
              timestamp: date.toISOString(),
            }),
          })
        }
      }
      // setOpenModal(false)
    } else {
      setErr('El usuario ingresado no existe, vuelve a intentar.')
    }
    setDisabled(false)
    setSuccesMsg('Confesión enviada con éxito')
    setTimeout(() => {
      setSuccesMsg('')
    }, 2000)
  }

  return (
    <div className='Form__mainLy'>
      <h2>¡Confiesa tu ligue!</h2>
      <h3>Escribe el username de tu crush</h3>
      <input
        type='text'
        ref={usernameRef}
        placeholder='@micrush'
        className='Form__input'
        onChange={(e) => {
          e.preventDefault()
          setMainSubject(e.target.value)
        }}
      />
      <button
        type='button'
        onClick={() => {
          confessCrush()
          // setOpenModal(b => !b)
        }}
        disabled={disabled || !owner}
        className='Form__formBtn'
      >
        enviar
      </button>
      <br />
      <strong style={{color: 'rgb(13, 187, 13)'}}>
        {succesMsg}
      </strong>
      <br />
      <p className='Form__alertLabel'>{err}</p>
      <h3>Lista de usuarios registrados: </h3>
      <div className='Form__scrollable'>
        {users.map((usr) => {
          let random = Math.random()
          return (
            <span style={{ display: 'block' }} key={`${usr.username}__${random}`}>
              {usr.username}
            </span>
          )
        })}
      </div>
    </div>
  )
}
