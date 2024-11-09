import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { auth } from '../../../../lib/sdk/firebase'

export const fromLayerZeroGetAuthCurrentUser = createAsyncThunk('firebase/currentUser',
	async (_, { rejectWithValue }) => {
    try {
        return new Promise((resolve, reject) => {
          auth.onAuthStateChanged(
            user => {
              if(user) {
                resolve(
                  {userData: { email: user.email, uid: user.uid }}
                )
              }
              reject('common rejection - no user')
            }
          )
        })
    } catch(sdkErr) {
      rejectWithValue(`thunk rejection - ${sdkErr.message}`)
    }

	}   // callback de asynThunk
)

const authLogicalSlice = createSlice({
  name: 'gAuth',
  initialState: {
    currentUser: null,
    loadingAuthSDK: true,
    errorInAuthSDK: false,
    currentUser: null,
  },
  reducers: {
    setUserUID: (state, action) => {
      state.currentUser = action.payload
    }
  },
  extraReducers: builder => {
    builder
    .addCase('firebase/currentUser/pending', (state, action) => {
      state.loading = false;
    })
    .addCase('firebase/currentUser/fulfilled', (state, action) => {
      state.currentUser = action.payload.userData;
    })
    .addCase('firebase/currentUser/rejected', (state, action) => {
      state.errorInAuthSDK = action;
    })
  }
})

export const { setUserUID } = authLogicalSlice.actions
export default authLogicalSlice.reducer;