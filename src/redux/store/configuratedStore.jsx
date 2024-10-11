import { configureStore } from '@reduxjs/toolkit'
import courseReducer from '../slices/mainSlice'

const configuratedStore = configureStore({
	reducer: {
		course: courseReducer
	}
})


export { configuratedStore }
