import { useRef, useState } from "react"
import { auth } from "../../lib/sdk/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
// import { useRouter } from "next/router"
import "../../assets/css/forms.css"

export const Login = () => {
  // const router = useRouter()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState("")

  const login = async (e) => {
    e.preventDefault()
    try {
      const email = emailRef.current.value
      const password = passwordRef.current.value
      await signInWithEmailAndPassword(auth, email, password)
      redirect(`${window.location.origin}`)
    } catch(error) {
      let errorCode = error.code
      if (errorCode == "auth/wrong-password") {
        setError("Contraseña incorrecta")
      }
    }
  }

  return (
    <>
      <h2>Acceso</h2>
        <span>Email</span>
        <input
          type="email"
          ref={emailRef}
          placeholder="name@somemail.com"
          className="input"
        />
        <span>Contraseña</span>
        <input
          type="password"
          ref={passwordRef}
          placeholder="mypass123"
          className="input"
        />
        <button
          type="button"
          onClick={login}
          className="formBtn"
        >
          Login
        </button>
        <small className="payMsg" style={{color:'red'}}>
          {error}
        </small>
        <small className="payMsg">
          ¿Nuevo por aquí?
          <span 
            className="text-primary"
            onClick={() => redirect(`${window.location.origin}/signup`)}
          >
            <u style={{ cursor: "pointer" }}>{" "}Crear cuenta</u>
          </span>
        </small>
        <small className="payMsg">
          <span 
            className="text-primary"
            onClick={() => redirect(`${window.location.origin}/password-recovery`)}
          >
            <u style={{ cursor: "pointer" }}>
              ¿Olvidaste la contraseña?
            </u>
          </span>
        </small>
    </>
  )
}
