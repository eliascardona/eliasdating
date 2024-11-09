import { Signup } from '../../components/vitals/Signup'
import '../../assets/css/signup.css'

export default function SignUpPage() {
  return (
    <>
      <div className='SignUp__centeredGrid'>
        <div className='SignUp__cardWhite'>
          <Signup />
        </div>
      </div>
    </>
  )
}
