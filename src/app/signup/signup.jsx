import { Signup } from '../../components/vitals/Signup'
import { PageHeader } from '../../components/utils/PageHeader'
import '../../assets/css/login.css'

export default function SignUpPage() {
  return (
    <>
      <PageHeader />
      <div className='centeredGrid'>
        <div className='cardWhite'>
          <Signup />
        </div>
      </div>
    </>
  )
}