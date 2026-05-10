import { useDispatch, useSelector } from 'react-redux'
import styles from './Profile.module.css'
import type { AppDispatch, RootState } from '../../state/store'
import { useState, type SubmitEvent } from 'react';
import supabase from '../../config/supabaseClient';
import {ToastContainer, toast} from 'react-toastify';
import { setStoreName, setUser } from '../../state/auth/authSlice';
import { motion } from 'framer-motion';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { TriangleAlert } from 'lucide-react';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [edit, setEdit] = useState(false);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch<AppDispatch>();
  
  const [delAcc, setDelAcc] = useState(false);

  const setConfirmDel = async () => {
    console.log("testing")
  }

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

  const handleDelete = async () => {
    console.log("testing")
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
                <button type='button' onClick={(e) => {
                  e.preventDefault();
                  setDelAcc(true);
                }} className='-translate-y-0.25 hover:translate-none duration-200 cursor-pointer active:cursor-default rounded bg-red-500 text-white px-5 py-2'>Delete Account</button>
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
      <Dialog
        open={delAcc}
        onClose={() => setDelAcc(false)}
        className="relative z-50"
      >
        <motion.div className="fixed inset-0 bg-black/60" 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        />
        
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
            <DialogPanel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%]">
                <div className='flex justify-center flex-col items-center gap-3'>
                    <TriangleAlert size={100} className='text-red-500'/>
                    <div className='text-center'>
                        <DialogTitle className="text-2xl font-bold">Are you sure?</DialogTitle>
                        <p className="text-gray-500">Warning: This action cannot be undone.</p>
                    </div>
                    <div className='flex gap-3'>
                        <button 
                            type="button"
                            className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                            onClick={() => handleDelete()}>
                                Yes
                        </button>
                        <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => setDelAcc(false)}>Cancel</button>
                    </div>
                </div>
            </DialogPanel>
        </div>
      </Dialog>
      <ToastContainer/>
    </>
  )
}

export default Profile
