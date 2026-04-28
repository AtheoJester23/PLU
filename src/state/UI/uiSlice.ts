import { createSlice } from "@reduxjs/toolkit";
import type { productDetails } from "../../pages/Home/Home";

type intialType = {
    theme: 'light' | 'dark';
    products: productDetails | []
}

const initialState: intialType = {
    theme: 'light',
    products: []
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setTheme(state, action){
            state.theme = action.payload;
        },
        setProductsState(state, action){
            state.products = action.payload;
        }
    }
})

export const {setTheme, setProductsState} = uiSlice.actions;
export default uiSlice;