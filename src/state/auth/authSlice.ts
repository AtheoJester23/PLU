import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        id: null,
    } 
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user.id = action.payload;
        }
    } 
})

export const {setUser} = authSlice.actions;
export default authSlice;