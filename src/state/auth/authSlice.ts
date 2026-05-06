import { createSlice } from "@reduxjs/toolkit";

type initialType = {
    user: {
        id: string | null,
        storeName: string | null,
        theme: 'light' | 'dark'
    }
}

const initialState: initialType = {
    user: {
        id: null,
        storeName: null,
        theme: 'light'
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