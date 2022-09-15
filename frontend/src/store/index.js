import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getData = createAsyncThunk('user/getData', async (id, { dispatch }) => {
    const response = await axios.get(`/profile/${id}`);
    return response;
})

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        message: null,
        data: {}
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getData.fulfilled, (state, action) => {
                state.data = action?.payload?.data || {}
            })
    }
})

export const actions = userSlice.actions

export default userSlice.reducer
