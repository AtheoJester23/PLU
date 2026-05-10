import { useDispatch, useSelector } from 'react-redux'
import styles from './Profile.module.css'
import type { AppDispatch, RootState } from '../../state/store'
import { useState, type SubmitEvent } from 'react';
import supabase from '../../config/supabaseClient';
import {ToastContainer, toast} from 'react-toastify';
import { setStoreName, setUser } from '../../state/auth/authSlice';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [edit, setEdit] = useState(false);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updatedStoreName = formData.get('storeName') as string;
    
    if(updatedStoreName.replace(/ /g, "") === ""){
      toast.error("Store name cannot be empty.", {
        position: "top-right",
        autoClose: 3000,
        theme: `${theme}`
      });
      return;
    }

    console.log("testing")

    try {
      const {data, error} = await supabase.from('profiles').update({
        store_name: updatedStoreName,
      }).eq('id', user.id);

      if(error) throw error;

      dispatch(setStoreName(updatedStoreName));

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('error saving profile changes:', error);
      toast.error("Failed to update profile.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }finally{
      setEdit(false);
    }
  }

  return (
    <>
      <main className={styles.mainCont}>
        <form onSubmit={(e) => handleSave(e)} className={styles.formCont}>
          <h1 className='p-0 m-0 text-nav'>Profile</h1>

          <ul>
              <li><strong>Store Name:</strong> {!edit ? user.storeName : <input type='text' name='storeName' spellCheck={false} autoComplete='off' className='border border-gray-200 px-5 py-3 rounded focus:outline-none' defaultValue={`${user.storeName}`}></input>}</li>
              {!edit &&
                <li><strong>Theme:</strong> {theme}</li>
              }
          </ul>

          <div className='flex gap-1 justify-end'>
            {!edit ? (
              <>
                <button type='button' className='-translate-y-0.25 hover:translate-none duration-200 cursor-pointer active:cursor-default rounded bg-red-500 text-white px-5 py-2'>Delete Account</button>
                <button type='button' onClick={(e) => {
                  e.preventDefault();
                  setEdit(true)
                }}
                  className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 duration-200 rounded bg-orange-500 text-white px-5 py-2'
                >
                  edit
                </button>
              </>
            ):(
              <>
                <button onClick={() => setEdit(false)} type="button" className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 duration-200 rounded bg-red-500 text-white px-5 py-2'>Cancel</button>
                <button type="submit" className='hover:cursor-pointer active:cursor-default -translate-y-0.25 hover:translate-none active:-translate-y-0.25 rounded bg-blue-500 text-white px-5 py-2 duration-200'>Save</button>
              </>
            )}
          </div>
        </form>
      </main>
      <ToastContainer/>
    </>
  )
}

export default Profile
