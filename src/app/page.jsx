import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import Loader from '../components/Loader'
import { routerListenerHook } from '../lib/hooks/navigation'

export default function Page() {
  const [loading, setLoading] = useState(false)

  const LoaderUIHandler = ({ children }) => {
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

  return (
    <LoaderUIHandler>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </LoaderUIHandler>
  )
}