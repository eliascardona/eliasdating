import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, firestore } from '../../lib/sdk/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { 
  collection,
  doc,  
  query,
  where,
  getDocs,
  setDoc
} from 'firebase/firestore'
import '../../assets/css/forms.css'


export const Signup = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const nameRef = useRef()
  const usernameRef = useRef()
  const [username, setUsername] = useState('')
  const [trimUsername, setTrimUsername] = useState('')
  const [usernameAllowed, setUsernameAllowed] = useState(false)
  const [showErr, setShowErr] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/')
      }
    })
  },[auth])

  useEffect(() => {
    async function checkUsername() {
      const usersRef = collection(firestore, 'users')
      const q = query(
        usersRef,
        where('username', '==', `@${username.trim()}`)
      )
      const querySnapshot = await getDocs(q)
      setUsernameAllowed(querySnapshot.docs.length === 0)
    }
    checkUsername()
    return (setUsernameAllowed(undefined))
  }, [username])

  const signUp = async () => {
    let name = nameRef.current.value
    name = name.trim()
    //Ponemos la primer letra de cada palabra del nombre en mayúscula.
    if(name.length > 0) {
      let words = name.split(' ')
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1)
      }
      name = words.join(' ')
    }
    setTrimUsername(username.trim())
    //setUsername(prev => username.trim())
    
    let email = emailRef.current.value
    email = email.trim()

    let password = passwordRef.current.value
    password = password.trim()

    const res = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(firestore, `users/${res.user.email}`), {
      email: res.user.email,
      id: res.user.uid,
      nombre: name,
      username: `@${trimUsername}`,
      likes: []
    })
  }
  
  const logOut = async () => {
    await signOut(auth)
    window.location.reload()
  }

const handleSignUp = async (e) => {
  e.preventDefault()
  setShowErr(false)
  if(usernameAllowed) {
    signUp()
    navigate('/')
  } else {
    setShowErr(true)
  }
}

  return (
    <>
      <h2>Crear cuenta</h2>
      <span className='Form__label'>Nombre y Apellido</span>
      <input
        type='text'
        ref={nameRef}
        placeholder='Nombre'
        className='Form__input'
      />
      <span className='Form__label'>username, no escribir @</span>
      <input
        type='text'
        ref={usernameRef}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='username'
        className='Form__input'
      />
      {
        showErr && 
        <span className='Form__alertLabel'>
          username en uso, escoge otro 😥
        </span>
      }
      <span className='Form__label'>Email</span>
      <input
        type='email'
        ref={emailRef}
        placeholder='name@somemail.com'
        className='Form__input'
      />
      <span className='Form__label'>Contraseña</span>
      <input
        type='password'
        ref={passwordRef}
        placeholder='mypass123'
        className='Form__input'
      />
      <button
        type='button'
        className='Form__formBtn'
        onClick={handleSignUp}
        disabled={usernameAllowed === undefined}
      >
        Sign up
      </button>
      <small className='Form__payMsg'>
        ¿Ya tienes cuenta?
        <span 
            className='Form__text-primary'
            onClick={() => navigate('/login')}
          >
          <u style={{ cursor: 'pointer' }}>{' '}Iniciar sesión</u>
        </span>
      </small>
      <small className='Form__payMsg'>
        Si ingresaste un email incorrecto, haz click
        <span onClick={logOut} className='Form__text-primary'>
          {' '}
          <u style={{ cursor: 'pointer' }}> aquí</u>
        </span>
      </small>
    </>
  )
}
