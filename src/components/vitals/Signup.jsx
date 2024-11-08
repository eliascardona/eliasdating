import { useEffect, useRef, useState } from "react";
import { auth, firestore } from "../../lib/sdk/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  collection,
  doc,  
  query,
  where,
  getDocs,
  setDoc
} from "firebase/firestore";
// import { useRouter } from "next/router";
import "../../assets/css/forms.css";
import { redirect } from "react-router-dom";


export const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const usernameRef = useRef();
  const [username, setUsername] = useState("")
  const [usernameAllowed, setUsernameAllowed] = useState(false)
  const [showErr, setShowErr] = useState(false)
  
  useEffect(() => {
    async function checkUsername() {
      const usersRef = collection(firestore, "users")
      const q = query(
        usersRef,
        where("username", "==", `@${username.trim()}`)
      )
      const querySnapshot = await getDocs(q)
      setUsernameAllowed(querySnapshot.docs.length === 0)
    }
    checkUsername()
    return (setUsernameAllowed(undefined))
  }, [username])

  const signUp = async () => {
    let name = nameRef.current.value;
    name = name.trim()
    //Ponemos la primer letra de cada palabra del nombre en mayúscula.
    if(name.length > 0) {
      const words = name.split(" ");
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
      }
      name = words.join(" ")
    }
    let userName = usernameRef.current.value;
    username = username.trim()
    let email = emailRef.current.value;
    email = email.trim()

    let password = passwordRef.current.value;
    password = password.trim()

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(firestore, `users/${res.user.email}`), {
      email: res.user.email,
      id: res.user.uid,
      nombre: name,
      username: `@${userName}`,
      likes: []
    });
  };
  
  const logOut = async () => {
    await signOut(auth);
    window.location.reload();
  };

const handleSignUp = async (e) => {
  e.preventDefault();
  setShowErr(false)
  if(usernameAllowed) {
    signUp()
    redirect(`${window.location.origin}`)
  } else {
    setShowErr(true)
  }
}

  return (
    <>
      <h2>Crear cuenta</h2>
      <span className="label">Nombre y Apellido</span>
      <input
        type="text"
        ref={nameRef}
        placeholder="Nombre"
        className="input"
      />
      <span className="label">username, no escribir @</span>
      <input
        type="text"
        ref={usernameRef}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        className="input"
      />
      {
        showErr && 
        <span className="alertLabel">
          username en uso, escoge otro 😥
        </span>
      }
      <span className="label">Email</span>
      <input
        type="email"
        ref={emailRef}
        placeholder="name@somemail.com"
        className="input"
      />
      <span className="label">Contraseña</span>
      <input
        type="password"
        ref={passwordRef}
        placeholder="mypass123"
        className="input"
      />
      <button
        type="button"
        className="formBtn"
        onClick={handleSignUp}
        disabled={usernameAllowed === undefined}
      >
        Sign up
      </button>
      <small className="payMsg">
        ¿Ya tienes cuenta?
        <span 
            className="text-primary"
            onClick={() => redirect(`${window.location.origin}/login`)}
          >
          <u style={{ cursor: "pointer" }}>{" "}Iniciar sesión</u>
        </span>
      </small>
      <small className="payMsg">
        Si ingresaste un email incorrecto, haz click
        <span onClick={logOut} className="text-primary">
          {" "}
          <u style={{ cursor: "pointer" }}> aquí</u>
        </span>
      </small>
    </>
  );
};
