import { Login } from '../../components/vitals/Login'
import '../../assets/css/login.css'

export default function LoginPage() {
  return (
    <>
      <div className='Login__centeredGrid'>
        <div className='Login__cardWhite'>
          <Login />
        </div>
      </div>
    </>
  )
}
