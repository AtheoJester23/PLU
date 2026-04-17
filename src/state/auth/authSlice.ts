import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
        }
    } 
})

export const {setSession} = authSlice.actions;
export default authSlice;