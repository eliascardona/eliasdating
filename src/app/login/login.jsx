import { Login } from '../../components/vitals/Login'
import { PageHeader } from '../../components/utils/PageHeader'
import '../../assets/css/login.css'

export default function LoginPage() {
  return (
    <>
      <PageHeader />
      <div className='Login__centeredGrid'>
        <div className='Login__cardWhite'>
          <Login />
        </div>
      </div>
    </>
  )
}