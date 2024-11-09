import { auth } from '../../lib/sdk/firebase'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

import '../../assets/css/pageheader.css'


export const PageHeader = () => {
  const navigate = useNavigate()

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
        <div>
          <h4 onClick={() => signOut(auth)}>
            <ion-icon name='exit-outline'></ion-icon>
          </h4>
        </div>
      </header>
    </>
  )
}
