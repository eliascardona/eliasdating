import { Login } from '../../components/vitals/Login'
import { PageHeader } from '../../components/utils/PageHeader'
import '../../assets/css/login.css'

export default function LoginPage() {
  return (
    <>
      <PageHeader />
      <div className='centeredGrid'>
        <div className='cardWhite'>
          <Login />
        </div>
      </div>
    </>
  )
}