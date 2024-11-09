import { auth } from '../../lib/sdk/firebase'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

import '../../assets/css/pageheader.css'


export const PageHeader = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className='headerStyles'>
        <div>
          <span 
            className='linkStyle'
            onClick={() => {
              navigate('/')
            }}
          >
            <span className='text'>
              DATE UN
            </span>
            {' '}
            <span className='font'>
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
