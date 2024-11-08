import { useContext, useEffect, useRef, useState } from 'react';
import { auth, firestore } from '../../lib/sdk/firebase';
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
} from 'firebase/firestore';
import { numeroAleatorio } from '../../lib/utils/utils'
// import { AuthContext } from '../../contexts/AuthContext';
import '../../assets/css/forms.css';


export const MatchForm = () => {
  // const authData = useContext(AuthContext);
  const [owner, setOwner] = useState();
  const [err, setErr] = useState('');
  const usernameRef = useRef();
  const [users, setUsers] = useState([]);
  const [ganadores, setGanadores] = useState();
  const [succesMsg, setSuccesMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  //get users collection data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'users'),
      (querySnapshot) => {
        const res = [];
        querySnapshot.forEach((doc) => {
          res.push(doc.data());
        });
        setUsers(res);
      }
    );
    return unsubscribe;
  }, [auth]);

  //get owner data
  useEffect(() => {
    if (auth.currentUser === null) return

    const q = query(
      collection(firestore, 'users'),
      where('email', '==', auth.currentUser ? auth.currentUser.email : '')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docs[0] && setOwner(querySnapshot.docs[0].data());
    });
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'ganadores'),
      (querySnapshot) => {
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setGanadores({
          porMasLikes: data[0],
          porPrimerosMatches: data[1],
        });
      }
    );
    return unsubscribe;
  }, []);

  // let userName = usernameRef.current.value
  const [mainSubject, setMainSubject] = useState('');

  const confessCrush = async () => {
    setErr('');
    setDisabled(true)
    const usersRef = collection(firestore, 'users');

    const trimmedMainSubject = mainSubject.trim();
    if (trimmedMainSubject[0] != '@') {
      trimmedMainSubject = `@${trimmedMainSubject}`;
    }

    if (trimmedMainSubject == owner.username) {
      setErr('No puedes ingresar tu propio usuario.');
      return;
    }

    //Consultar perfil del destinatario
    const destinatario = query(usersRef, where('username', '==', mainSubject));
    const consultaDesatinatario = await getDocs(destinatario);
    const objetoDestinatario = consultaDesatinatario.docs[0]
      ? consultaDesatinatario.docs[0].data()
      : undefined;

    //Consultar perfil del remitente
    //A pesar de que sea un arreglo, la variable la dejamos como 'objetoRemitente'
    const remitente = query(usersRef, where('username', '==', owner.username));
    const consultaRemitente = await getDocs(remitente);
    const objetoRemitente = consultaRemitente.docs[0].data().likes;
    const usernameRemitente = consultaRemitente.docs[0].data().username;

    if (objetoDestinatario) {
      if (objetoDestinatario.likes.includes(usernameRemitente)) {
        setErr("Ya le enviaste tu confesión al usuario ingresado 🤷‍♂️")
        setDisabled(false)
        setErr("")        
        return
      }
      let docID = `p${numeroAleatorio()}`;
      let date = new Date();
      await updateDoc(doc(firestore, 'users', objetoDestinatario.email), {
        likes: arrayUnion(owner.username),
      })
      const updatedDestinatario = await getDoc(doc(firestore, 'users', objetoDestinatario.email)).then((doc) => doc.data())

      if(updatedDestinatario.likes.length > ganadores.porMasLikes.likes) {
        setDoc(doc(firestore, 'ganadores', 'porMasLikes'), {
          likes: updatedDestinatario.likes.length,
          username: updatedDestinatario.username
        })
      }

      await setDoc(doc(firestore, 'posts', docID), {
        remitente: owner.username,
        destinatario: mainSubject,
        cardID: docID,
        timestamp: date.getTime(),
      });

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
        );

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
          });
        }
      }
      // setOpenModal(false)
    } else {
      setErr('El usuario ingresado no existe, vuelve a intentar.');
    }
    setDisabled(false)
    setSuccesMsg("Confesión enviada con éxito")
    setTimeout(() => {
      setSuccesMsg("")
    }, 4000)
  };

  return (
    <div className="mainLy">
      <h2>¡Confiesa tu ligue!</h2>
      <h3>Escribe el username de tu crush</h3>
      <input
        type="text"
        ref={usernameRef}
        placeholder="@micrush"
        className="input"
        onChange={(e) => {
          e.preventDefault();
          setMainSubject(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={() => {
          confessCrush()
          // setOpenModal(b => !b)
        }}
        disabled={disabled || !owner}
        className="formBtn"
      >
        enviar
      </button>
      <br />
      <strong style={{color: 'rgb(13, 187, 13)'}}>
        {succesMsg}
      </strong>
      <br />
      <p className="alertLabel">{err}</p>
      <h3>Lista de usuarios registrados: </h3>
      <div className="scrollable">
        {users.map((usr) => {
          return (
            <span style={{ display: 'block' }} key={usr.username}>
              {usr.username}
            </span>
          );
        })}
      </div>
    </div>
  );
};
