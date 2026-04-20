import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        id: null,
        storeName: null
    } 
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user.id = action.payload;
        },
        setStoreName: (state, action) => {
            state.user.storeName = action.payload;
        }
    } 
})

export const {setUser, setStoreName} = authSlice.actions;
export default authSlice;