import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { configuratedStore } from './redux/store/configuratedStore'
import Page from './app/page.jsx'
import './assets/css/globals.css'

createRoot(document.getElementById('root'))
.render(
	<BrowserRouter>
		<Page />
	</BrowserRouter>
)
