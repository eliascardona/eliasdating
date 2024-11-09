import { Signup } from '../../components/vitals/Signup'
import { PageHeader } from '../../components/utils/PageHeader'
import '../../assets/css/login.css'

export default function SignUpPage() {
  return (
    <>
      <PageHeader />
      <div className='Login__centeredGrid'>
        <div className='Login__cardWhite Login__cardWMargin'>
          <Signup />
        </div>
      </div>
    </>
  )
}
