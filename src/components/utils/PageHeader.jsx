import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/sdk/firebase'
import { signOut } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

import '../../assets/css/pageheader.css'


export default function PageHeader() {
  const navigate = useNavigate()
  const [logoutVisible, setLogoutVisible] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setLogoutVisible(b => !b)
        console.log(`DESDE PAGE HEADER --${user.uid}`)
	  }
      setLogoutVisible(false)
	})
  }, [auth])

  return (
    <>
      <header className='Header__baseStyle'>
        <div>
          <span 
            className='Header__linkStyle'
            onClick={() => {
              navigate('/')
            }}
          >
            <span className='Header__text'>
              DATE UN
            </span>
            {' '}
            <span className='Header__font'>
              DATE
            </span>
          </span>
        </div>
        {
          logoutVisible && 
          <div onClick={() => signOut(auth)}>
            <ion-icon name='exit-outline'></ion-icon>
          </div>
        }
      </header>
    </>
  )
}
