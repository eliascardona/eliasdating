import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/sdk/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'

import '../../assets/css/forms.css'


export const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/')
      }
    })
  },[auth])

  const login = async (e) => {
    e.preventDefault()
    try {
      const email = emailRef.current.value
      const password = passwordRef.current.value
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch(error) {
      let errorCode = error.code
      if (errorCode == 'auth/wrong-password') {
        setError('Contraseña incorrecta')
      }
    }
  }

  return (
    <>
      <h2>Acceso</h2>
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
          onClick={login}
          className='Form__formBtn'
        >
          Acceder
        </button>
        <small className='Form__payMsg' style={{color:'red'}}>
          {error}
        </small>
        <small className='Form__payMsg'>
          ¿Nuevo por aquí?
          <span 
            className='text-primary'
            onClick={() => navigate('/signup')}
          >
            <u style={{ cursor: 'pointer' }}>{' '}Crear cuenta</u>
          </span>
        </small>
        <small className='payMsg'>
          <span 
            className='text-primary'
            onClick={() => navigate('/password-recovery')}
          >
            <u style={{ cursor: 'pointer' }}>
              ¿Olvidaste la contraseña?
            </u>
          </span>
        </small>
    </>
  )
}
