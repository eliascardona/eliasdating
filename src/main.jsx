import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { configuratedStore } from './redux/store/configuratedStore.jsx'
import Page from './app/page.jsx'


createRoot(document.getElementById('root'))
.render(
	<Provider store={configuratedStore}>
		<BrowserRouter>
			<Page />
		</BrowserRouter>
	</Provider>
)
