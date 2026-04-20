import { LogOut, Moon, Plus } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../state/store'
import { setTheme } from '../../state/UI/uiSlice'

const Menu = () => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const dispatch = useDispatch<AppDispatch>()

    const changeTheme = () => {
        dispatch(setTheme(theme == "light" ? "dark" : "light"))
    };

  return (
    <main className='pt-[65px] p-7 bg-main h-[100dvh]'>
      <h1 className={`text-center text-2xl font-bold text-${theme == "light" ? "nav" : "sub"}`}>Menu</h1>
      <ul className='mt-5 p-2 flex flex-col gap-3'>
        <li className='flex rounded-lg'>
            <button onClick={() => changeTheme()} role='switch' className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <Moon aria-hidden="true"/>
                    <span className='font-bold'>Dark Mode</span>
                </div>
            </button>
        </li>
        <li className='flex rounded-lg'>
            <button role='switch' className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <Plus aria-hidden="true"/>
                    <span className='font-bold'>Add product</span>
                </div>
            </button>
        </li>
        <li className='flex rounded-lg'>
            <button role='switch' className='border w-full border-nav border-2 border-dashed rounded flex justify-between p-3'>
                <div className={`flex gap-2 text-${theme == "light" ? "nav" : "white"}`}>
                    <LogOut aria-hidden="true"/>
                    <span className='font-bold'>Logout</span>
                </div>
            </button>
        </li>
      </ul>
    </main>
  )
}

export default Menu
