import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const routerListenerHook = (setLoading) => {
    const location = useLocation()
    const navigationType = useNavigationType()

    useEffect(() => {
        const startLoading = () => {
            setLoading(true)
        }

        const stopLoading = () => {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }

        startLoading()
        stopLoading()

        return () => {
            stopLoading()
        }
    }, [location, navigationType])
}



export { routerListenerHook }