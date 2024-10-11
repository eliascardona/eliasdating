import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCourseDetails = createAsyncThunk(
	'course/fetchDetails',
	async (courseId, thunkAPI) => {
		const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${courseId}`)
		const data = await response.json()
		return data
	}
)


const courseSlice = createSlice({
  name: 'course',
  initialState: {
    loading: true,
    error: null,
    courseDetails: null,
    priceId: null,
    paymentIntent: null,
    purchaseComplete: false,
  },
  reducers: {
    resetPurchaseState: (state, action) => {
      state.purchaseComplete = false;
      state.paymentIntent = null;
    },
    setPriceId: (state, action) => {
      state.priceId = action.payload;
    },
    completePurchase: (state) => {
      state.purchaseComplete = true;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourseDetails.pending, (state, action) => {
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.courseDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  }
})




export const { setPriceId, resetPurchaseState } = courseSlice.actions;
export default courseSlice.reducer;
