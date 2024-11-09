import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/sdk/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { PageHeader } from '../../components/utils/PageHeader'

import '../../assets/css/forgotPassword.css'


export default function ForgotPass() {
  const emailRef = useRef()
  const msgRef = useRef(null)
  const navigate = useNavigate()

  const requestLink = async (e) => {
    e.preventDefault()
    let userEmail = emailRef.current?.value
    await sendPasswordResetEmail(auth, userEmail)
    msgRef.current.style.display = 'block'

    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }
  
  return (
    <>
      <PageHeader />
      <div className='centeredGrid'>
        <div className='cardWhite'>
          <h2>Recuperar contraseña</h2>
            <span>Ingresa el correo con el que te registraste</span>
            <input
              type='email'
              ref={emailRef}
              placeholder='name@somemail.com'
              className='input'
            />
            <button
              type='button'
              onClick={requestLink}
              className='formBtn'
            >
              Enviar código
            </button>
            <span className='formDynamicMsg' ref={msgRef}>
              {'hemos enviado el código a tu correo electrónico, revisa tu bandeja de entrada'}
            </span>
            <small 
              className='formMsg' 
              onClick={() => navigate('/login')}
            >
              Regresar al login
            </small>
          </div>
        </div>
    </>
  )
}