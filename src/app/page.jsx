import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from './signup/signup'
import LoginPage from './login/login'
import ForgotPass from './forgot/forgotPass'
import WinnersPage from './winners/winners'
import HomePage from './home/home'
import Loader from '../components/Loader'
import { routerListenerHook } from '../lib/hooks/navigation'

function LoaderUIHandler({ loading, setLoading, children }) {
  routerListenerHook(setLoading)
  return (
    <>
      {
        loading ? (
          <Loader />
        ) : (
          <div id='applicationsContent'>
            {children}
          </div>
        )
      }
    </>
  )
}

export default function Page() {
  const [loading, setLoading] = useState(false)

  return (
    <LoaderUIHandler loading={loading} setLoading={setLoading}>
      <Routes>
        <Route path='/' exact element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/password-recovery' element={<ForgotPass />} />
        <Route path='/winners' element={<WinnersPage />} />
      </Routes>
    </LoaderUIHandler>
  )
}